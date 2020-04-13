import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withT } from '../providers/i18n'
import { getCount, increment } from '../../store/example'
import type { ReactElement } from 'react'
import type { WithTProps } from '../providers/i18n'

interface Props extends
  ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps>,
  WithTProps {}

/**
 * Map values from state to component props.
 *
 * @param state - The current state of the application.
 * @private
 */
function mapStateToProps (state) { /* eslint-disable-line @typescript-eslint/explicit-function-return-type */
  return {
    count: getCount(state)
  }
}

/**
 * Map action creators to action dispachers as component props.
 *
 * @param dispatch - The store dispatch function.
 * @private
 */
function mapDispatchToProps (dispatch) { /* eslint-disable-line @typescript-eslint/explicit-function-return-type */
  return bindActionCreators({
    increment
  }, dispatch)
}

class Counter extends PureComponent<Props> {
  /**
   * Create a component instance.
   *
   * @param props - The component props.
   * @public
   */
  constructor (props) {
    super(props)

    this.handleIncrementByOne = this.handleIncrementByOne.bind(this)
    this.handleIncrementByTen = this.handleIncrementByTen.bind(this)
  }

  /**
   * Handle `increment by one` events.
   *
   * @private
   */
  handleIncrementByOne (): void {
    const { increment } = this.props

    increment()
  }

  /**
   * Handle `increment by ten` events.
   *
   * @private
   */
  handleIncrementByTen (): void {
    const { increment } = this.props

    increment(10)
  }

  /**
   * Render the component.
   *
   * @public
   */
  render (): ReactElement {
    const { count, t } = this.props

    return (
      <div>
        <h2>{t('example.currentCount', { count })}</h2>
        <button onClick={this.handleIncrementByOne}>+1</button>
        <button onClick={this.handleIncrementByTen}>+10</button>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withT(Counter))
