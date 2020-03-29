import React from 'react'
import cn from 'classnames'
import { pickBy, isUndefined } from 'lodash'
import {
  JustifyContentProperty,
  OverflowXProperty,
  OverflowYProperty,
  AlignItemsProperty,
  AlignSelfProperty,
  PositionProperty,
} from 'csstype'

function isDefined(o: object): boolean {
  return !isUndefined(o)
}

interface IProps {
  lineHeight?: number
  overflow?: string
  overflowX?: OverflowXProperty
  overflowY?: OverflowYProperty
  marginTop?: number
  margin?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  bottom?: number
  minWidth?: number
  width?: number
  maxWidth?: number
  height?: number | string
  maxHeight?: number | string
  padding?: number
  inline?: boolean
  justifyContent?: JustifyContentProperty
  justifyContentCenter?: boolean
  justifyContentSpaceBetween?: boolean
  alignItems?: AlignItemsProperty
  alignItemsCenter?: boolean
  alignSelf?: AlignSelfProperty
  flex?: boolean
  flexGrow?: number
  flexDirectionColumn?: boolean
  fullHeight?: boolean
  fullWidth?: boolean
  position?: PositionProperty
  noWrap?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?(): void
}

const Container: React.FunctionComponent<IProps> = (props: IProps): JSX.Element => {
  const styles: React.CSSProperties = React.useMemo((): React.CSSProperties => {
    const justifyContentSpaceBetween = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }

    return pickBy(
      {
        alignItems: props.alignItems,
        alignSelf: props.alignSelf,
        bottom: props.bottom,
        flexGrow: props.flexGrow,
        height: props.height,
        justifyContent: props.justifyContent,
        lineHeight: props.lineHeight ? `${props.lineHeight}px` : undefined,
        margin: props.margin,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        marginTop: props.marginTop,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth,
        minWidth: props.minWidth,
        overflow: props.overflow,
        overflowX: props.overflowX,
        overflowY: props.overflowY,
        padding: props.padding,
        position: props.position,
        width: props.width,
        ...(props.flex ? { display: 'flex', flexWrap: 'wrap' } : {}),
        ...(props.alignItemsCenter ? { alignItems: 'center', display: 'flex' } : {}),
        ...(props.justifyContentCenter ? { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' } : {}),
        ...(props.justifyContentSpaceBetween ? justifyContentSpaceBetween : {}),
        ...(props.fullHeight ? { height: '100%' } : {}),
        ...(props.fullWidth ? { width: '100%' } : {}),
        ...(props.flexDirectionColumn ? { display: 'flex', flexDirection: 'column', flexWrap: 'wrap' } : {}),
        ...(props.noWrap ? { flexWrap: 'nowrap' } : {}),
        ...(props.inline ? { display: 'inline-block'} : {}),
        ...(props.style ? props.style : {}),
      },
      isDefined,
    )
  }, [props])

  return (
    <div onClick={props.onClick} className={cn(props.className)} style={styles}>
      {props.children}
    </div>
  )
}

export default Container
