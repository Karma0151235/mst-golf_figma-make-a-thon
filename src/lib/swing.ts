export type Pose = {
  arms: number // arm swing around the chest (rad, - = backswing)
  wrist: number // wrist hinge of the club relative to arms
  torso: number // shoulder turn (rad, - = away from target)
  hips: number // hip turn
  bend: number // forward spine tilt
  shift: number // lateral weight shift toward target (m)
}

export type Lesson = {
  id: string
  keys: { t: number; pose: Pose; label?: string }[]
  ball: 'none' | 'drive' | 'putt'
  impact?: number
}

export const ADDRESS: Pose = { arms: 0, wrist: 0, torso: 0, hips: 0, bend: 0.42, shift: 0 }
