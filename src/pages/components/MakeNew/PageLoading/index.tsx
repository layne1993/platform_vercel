import React from 'react'
import { Spin } from 'antd'
import _styles from './styles.less'

type T = React.ReactNode;

interface defaultProps {
  children: T;
  loading: boolean;
}

/**
 * @descripttion:
 * @param {defaultProps} props 
 * @return {*}
 */
function PageLoading(props: defaultProps): JSX.Element {
  const { children, loading } = props

  return <div className={_styles.loadingWrapper}>
    {children}
    {
      loading && <div className={_styles.loading}>
        <Spin />
      </div>
    }
  </div>
}

export default PageLoading