import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

import { ADDRESS, type Lesson, type Pose } from '../lib/swing'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function sample(lesson: Lesson, time: number): { pose: Pose; label?: string } {
  const k = lesson.keys
  const dur = k[k.length - 1].t
  const t = dur > 0 ? time % dur : 0
  let i = 0
  while (i < k.length - 2 && t > k[i + 1].t) i++
  const a = k[i]
  const b = k[i + 1] ?? a
  const span = b.t - a.t || 1
  const u = ease(Math.min(1, Math.max(0, (t - a.t) / span)))
  const pose = {} as Pose
  ;(Object.keys(ADDRESS) as (keyof Pose)[]).forEach((p) => (pose[p] = lerp(a.pose[p], b.pose[p], u)))
  // Label of the most recent keyframe that has one
  let label: string | undefined
  for (let j = 0; j < k.length; j++) if (k[j].t <= t + 0.001 && k[j].label) label = k[j].label
  return { pose, label }
}

const UP = new THREE.Vector3(0, 1, 0)

function Limb({
  from,
  to,
  r,
  color,
}: {
  from: [number, number, number]
  to: [number, number, number]
  r: number
  color: string
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const d = b.clone().sub(a)
    return {
      pos: a.clone().add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize()),
      len: d.length(),
    }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <capsuleGeometry args={[r, Math.max(0.001, len - r * 2), 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )
}

const SHIRT = '#009639'
const PANTS = '#1c1f1c'
const SKIN = '#c99677'
const WHITE = '#f4f5f1'

// Static joint positions (memoised tuples so Limb doesn't recompute)
const J = {
  shL: [0.19, 0, 0.02] as [number, number, number],
  shR: [-0.19, 0, 0.02] as [number, number, number],
  hands: [0, -0.58, 0.16] as [number, number, number],
  hipL: [0.12, 0.95, 0] as [number, number, number],
  hipR: [-0.12, 0.95, 0] as [number, number, number],
  kneeL: [0.2, 0.5, 0.08] as [number, number, number],
  kneeR: [-0.2, 0.5, 0.08] as [number, number, number],
  ankL: [0.24, 0.07, 0] as [number, number, number],
  ankR: [-0.24, 0.07, 0] as [number, number, number],
}

function Golfer({
  lesson,
  playing,
  speed,
  onPhase,
}: {
  lesson: Lesson
  playing: boolean
  speed: number
  onPhase?: (label: string) => void
}) {
  const root = useRef<THREE.Group>(null)
  const pelvis = useRef<THREE.Group>(null)
  const spine = useRef<THREE.Group>(null)
  const turn = useRef<THREE.Group>(null)
  const arms = useRef<THREE.Group>(null)
  const club = useRef<THREE.Group>(null)
  const ball = useRef<THREE.Mesh>(null)
  const time = useRef(0)
  const lastLabel = useRef('')
  const [rig, setRig] = useState<{ dir: THREE.Vector3; len: number; ball: THREE.Vector3 } | null>(null)

  const apply = (p: Pose) => {
    if (!pelvis.current || !spine.current || !turn.current || !arms.current || !club.current) return
    pelvis.current.position.x = p.shift
    pelvis.current.rotation.y = p.hips
    spine.current.rotation.x = p.bend
    turn.current.rotation.y = p.torso - p.hips
    arms.current.rotation.z = p.arms
    club.current.rotation.z = p.wrist
  }

  // Fit the club so its head rests on the ground at address, and place the ball there.
  useLayoutEffect(() => {
    apply(ADDRESS)
    root.current!.updateMatrixWorld(true)
    const hands = club.current!.getWorldPosition(new THREE.Vector3())
    const head = new THREE.Vector3(hands.x, 0.035, hands.z + 0.32)
    const local = club.current!.worldToLocal(head.clone())
    setRig({ dir: local.clone().normalize(), len: local.length(), ball: head.clone().add(new THREE.Vector3(0.06, 0, 0)) })
  }, [])

  useFrame((_, dt) => {
    if (playing) time.current += Math.min(dt, 0.05) * speed
    const { pose, label } = sample(lesson, time.current)
    apply(pose)
    if (label && label !== lastLabel.current) {
      lastLabel.current = label
      onPhase?.(label)
    }
    // Ball flight
    if (ball.current && rig) {
      const dur = lesson.keys[lesson.keys.length - 1].t
      const t = dur ? time.current % dur : 0
      const since = lesson.impact !== undefined ? t - lesson.impact : -1
      const b = rig.ball
      if (lesson.ball === 'drive' && since > 0) {
        ball.current.position.set(b.x + since * 7, b.y + since * 5.5 - 4.9 * since * since * 0.6, b.z - since * 4)
        ball.current.visible = since < 1.6
      } else if (lesson.ball === 'putt' && since > 0) {
        const s = Math.min(since, 1.4)
        ball.current.position.set(b.x + 1.1 * s - 0.35 * s * s, b.y, b.z)
        ball.current.visible = true
      } else {
        ball.current.position.copy(b)
        ball.current.visible = true
      }
    }
  })

  const shaftQuat = useMemo(
    () => (rig ? new THREE.Quaternion().setFromUnitVectors(UP, rig.dir) : new THREE.Quaternion()),
    [rig],
  )

  return (
    <group ref={root}>
      {/* Legs (fixed) */}
      <Limb from={J.hipL} to={J.kneeL} r={0.075} color={PANTS} />
      <Limb from={J.kneeL} to={J.ankL} r={0.065} color={PANTS} />
      <Limb from={J.hipR} to={J.kneeR} r={0.075} color={PANTS} />
      <Limb from={J.kneeR} to={J.ankR} r={0.065} color={PANTS} />
      {[J.ankL, J.ankR].map((a, i) => (
        <mesh key={i} position={[a[0], 0.045, a[2] + 0.06]} castShadow>
          <boxGeometry args={[0.11, 0.09, 0.27]} />
          <meshStandardMaterial color={WHITE} roughness={0.4} />
        </mesh>
      ))}

      <group ref={pelvis} position={[0, 0.95, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.15, 0.12, 6, 12]} />
          <meshStandardMaterial color={PANTS} roughness={0.7} />
        </mesh>
        <group ref={spine}>
          <group ref={turn}>
            {/* Torso */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <capsuleGeometry args={[0.17, 0.32, 8, 16]} />
              <meshStandardMaterial color={SHIRT} roughness={0.55} />
            </mesh>
            {/* Collar stripe */}
            <mesh position={[0, 0.53, 0]}>
              <torusGeometry args={[0.1, 0.022, 8, 24]} />
              <meshStandardMaterial color={WHITE} />
            </mesh>
            {/* Head + cap */}
            <group position={[0, 0.72, 0.02]}>
              <mesh castShadow>
                <sphereGeometry args={[0.13, 24, 24]} />
                <meshStandardMaterial color={SKIN} roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.055, 0]} castShadow>
                <sphereGeometry args={[0.135, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={WHITE} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.06, 0.12]} rotation={[-0.25, 0, 0]}>
                <boxGeometry args={[0.2, 0.012, 0.12]} />
                <meshStandardMaterial color={SHIRT} />
              </mesh>
            </group>
            {/* Arms + club */}
            <group ref={arms} position={[0, 0.5, 0]}>
              <Limb from={J.shL} to={J.hands} r={0.05} color={SKIN} />
              <Limb from={J.shR} to={J.hands} r={0.05} color={SKIN} />
              {/* sleeves */}
              <Limb from={J.shL} to={[0.14, -0.14, 0.06]} r={0.065} color={SHIRT} />
              <Limb from={J.shR} to={[-0.14, -0.14, 0.06]} r={0.065} color={SHIRT} />
              <group ref={club} position={J.hands}>
                {/* glove/hands */}
                <mesh castShadow>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial color={WHITE} />
                </mesh>
                {rig && (
                  <>
                    <mesh
                      position={rig.dir.clone().multiplyScalar(rig.len / 2)}
                      quaternion={shaftQuat}
                      castShadow
                    >
                      <cylinderGeometry args={[0.009, 0.014, rig.len, 8]} />
                      <meshStandardMaterial color="#cfd4d6" metalness={0.8} roughness={0.25} />
                    </mesh>
                    <mesh position={rig.dir.clone().multiplyScalar(0.12)} quaternion={shaftQuat}>
                      <cylinderGeometry args={[0.02, 0.02, 0.24, 10]} />
                      <meshStandardMaterial color="#111" roughness={0.9} />
                    </mesh>
                    <mesh position={rig.dir.clone().multiplyScalar(rig.len)} quaternion={shaftQuat} castShadow>
                      <boxGeometry args={[0.12, 0.05, 0.05]} />
                      <meshStandardMaterial color="#2b2e2b" metalness={0.7} roughness={0.3} />
                    </mesh>
                  </>
                )}
              </group>
            </group>
          </group>
        </group>
      </group>

      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
    </group>
  )
}

export function SwingScene({
  lesson,
  playing,
  speed,
  onPhase,
}: {
  lesson: Lesson
  playing: boolean
  speed: number
  onPhase?: (label: string) => void
}) {
  return (
    <Canvas shadows camera={{ position: [0, 1.2, 3.4], fov: 40 }} dpr={[1, 2]}>
      <fog attach="fog" args={['#07110b', 4, 11]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#dff5e6', '#0b2e1b', 0.6]} />
      <directionalLight position={[2.5, 5, 3]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-3, 4, -2]} intensity={18} angle={0.6} penumbra={1} color="#19c25a" />

      {/* Arena floor + hitting mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#0b2e1b" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.25]} receiveShadow>
        <planeGeometry args={[1.8, 1.3]} />
        <meshStandardMaterial color="#12502c" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.6]}>
        <planeGeometry args={[1.8, 0.015]} />
        <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>

      <Golfer key={lesson.id} lesson={lesson} playing={playing} speed={speed} onPhase={onPhase} />
      <ContactShadows position={[0, 0.008, 0]} opacity={0.55} scale={4} blur={2.4} far={2} />
      <OrbitControls
        target={[0, 0.8, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
