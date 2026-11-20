export interface TrainingTask {
  id: string
  title: string
}

export interface TrainingModule {
  id: string
  title: string
  tasks: TrainingTask[]
}

export const STORAGE_KEY = 'dc-training-completed'

export const trainingModules: TrainingModule[] = [
  {
    id: 'foundations',
    title: 'Data center foundations',
    tasks: [
      { id: 'foundations-tiers', title: 'Write lesson on Uptime Institute tiers (I–IV)' },
      { id: 'foundations-layout', title: 'Diagram hot/cold aisle layout and rack anatomy' },
      { id: 'foundations-glossary', title: 'Build glossary of core DC terms' },
    ],
  },
  {
    id: 'power',
    title: 'Power & cooling',
    tasks: [
      { id: 'power-chain', title: 'Explain power chain: utility → UPS → PDU → rack' },
      { id: 'power-cooling', title: 'Cover CRAC/CRAH units and PUE calculation' },
      { id: 'power-lab', title: 'Create hands-on lab: read a PDU load report' },
    ],
  },
  {
    id: 'operations',
    title: 'Operations & safety',
    tasks: [
      { id: 'ops-safety', title: 'Document safety rules (ESD, LOTO, PPE)' },
      { id: 'ops-remote-hands', title: 'Write remote-hands procedures (cabling, swaps)' },
      { id: 'ops-incident', title: 'Prepare incident response and escalation scenario' },
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment',
    tasks: [
      { id: 'assessment-quiz', title: 'Write quiz questions for each module' },
      { id: 'assessment-final', title: 'Design final practical assessment' },
    ],
  },
]
