import { Achievement } from '@/types/achievements';
import { Award, Star, Clock, Zap } from 'lucide-react';

export const achievements: Achievement[] = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Complete your first level',
    icon: <Award className="h-5 w-5 text-[#e86bdf]" />,
    condition: (stats) => stats.completedLevels.length > 0
  },
  {
    id: 'no_hints',
    name: 'Self Reliant',
    description: 'Complete a level without using any hints',
    icon: <Star className="h-5 w-5 text-[#ff9ef5]" />,
    condition: (stats) => stats.completedWithoutHints.length > 0
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a level in under 2 minutes',
    icon: <Clock className="h-5 w-5 text-[#6b7eff]" />,
    condition: (stats) => stats.speedCompletions.length > 0
  },
  {
    id: 'master_hacker',
    name: 'Master Hacker',
    description: 'Complete all levels',
    icon: <Zap className="h-5 w-5 text-[#5eead4]" />,
    condition: (stats) => stats.completedLevels.length >= 6 // Assuming 6 levels total
  },
  {
    id: 'randomness_expert',
    name: 'Randomness Expert',
    description: 'Complete the Coin Flip level',
    icon: <Award className="h-5 w-5 text-[#6e56cf]" />,
    condition: (stats) => stats.completedLevels.includes(3) // Assuming Coin Flip is level 3
  },
  {
    id: 'reentrancy_master',
    name: 'Reentrancy Master',
    description: 'Complete the Reentrancy level',
    icon: <Award className="h-5 w-5 text-[#e86bdf]" />,
    condition: (stats) => stats.completedLevels.includes(4) // Assuming Reentrancy is level 4
  },
  {
    id: 'storage_manipulator',
    name: 'Storage Manipulator',
    description: 'Complete the Storage Manipulation level',
    icon: <Award className="h-5 w-5 text-[#6b7eff]" />,
    condition: (stats) => stats.completedLevels.includes(5) // Assuming Storage Manipulation is level 5
  },
  {
    id: 'cross_contract_expert',
    name: 'Cross-Contract Expert',
    description: 'Complete the Cross-Contract Attack level',
    icon: <Award className="h-5 w-5 text-[#5eead4]" />,
    condition: (stats) => stats.completedLevels.includes(6) // Assuming Cross-Contract Attack is level 6
  }
];
