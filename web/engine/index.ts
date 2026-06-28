export { KumbreEngine } from './KumbreEngine'
export type { FullAnalysis } from './KumbreEngine'

export type {
  FinancialSnapshot,
  EngineAccount,
  EngineTransaction,
  EngineDebt,
  EngineInvestment,
  EngineObjective,
  EngineFund,
  FundAllocationRule,
  Rule,
  RuleKind,
  Decision,
  DecisionType,
  Assumptions,
} from './types/inputs'

export { SCENARIO_PRESETS } from './types/inputs'

export type {
  CashFlowResult,
  NetWorthResult,
  DebtResult,
  GoalResult,
  FundResult,
  CapacityResult,
  RuleEvaluationResult,
  ProjectionResult,
  ScenarioResult,
  SimulationResult,
  TimelinePoint,
  RiskLevel,
  ObjectiveDetail,
  CategoryBreakdown,
  GoalImpact,
  GoalDelay,
  CashFlowImpact,
  DebtImpact,
  NetWorthImpact,
  SavingsImpact,
  RecommendationData,
} from './types/outputs'

export {
  calculateCashFlow,
  calculateNetWorth,
  calculateDebt,
  calculateGoals,
  calculateFunds,
  calculateCapacity,
  evaluateRules,
  project,
  compareScenarios,
  simulate,
} from './KumbreEngine'

export { buildSnapshot } from './adapters/fromDomain'
