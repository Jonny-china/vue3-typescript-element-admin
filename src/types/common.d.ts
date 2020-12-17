import { RuleItem } from 'async-validator'

export type ComponentSize = 'large' | 'medium' | 'small' | 'mini'

export interface FormRuleItem extends RuleItem {
  trigger: 'blur' | 'change'
}

export interface FormRules {
  [field: string]: FormRuleItem | FormRuleItem[]
}
