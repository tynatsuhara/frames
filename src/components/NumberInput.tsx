import { Component } from 'solid-js'
import styles from './NumberInput.module.css'

type Props = {
  label: string
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  step?: number
}

export const NumberInput: Component<Props> = (props) => {
  return (
    <div class={styles.NumberInput}>
      <span class={styles.NumberInputLabel}>
        <strong>{props.label}</strong>
      </span>
      <input
        type="number"
        {...props}
        onChange={(e) => props.onChange(Number.parseFloat(e.currentTarget.value))}
      ></input>
    </div>
  )
}
