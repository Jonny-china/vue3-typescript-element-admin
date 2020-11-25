import { RuleItem } from 'async-validator'

export interface FormRuleItem extends RuleItem {
  trigger: 'blur' | 'change'
}

export interface FormRules {
  [field: string]: FormRuleItem | FormRuleItem[]
}
