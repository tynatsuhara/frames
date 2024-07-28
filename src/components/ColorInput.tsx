import { Component } from 'solid-js'
import styles from './Inputs.module.css'

type Props = {
  label: string
  value: string
  onChange: (n: string) => void
}

export const ColorInput: Component<Props> = (props) => {
  return (
    <div class={styles.NumberInput}>
      <span class={styles.NumberInputLabel}>
        <strong>{props.label}</strong>
      </span>
      <input
        type="color"
        {...props}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      ></input>
    </div>
  )
}
