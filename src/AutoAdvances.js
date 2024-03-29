import React from 'react';
import ProptTypes from 'prop-types';

export default (Component, propName, upperBoundPropName) =>
  class ComponentWithAutoAdvance extends React.PureComponent {
    static displayName = `AutoAdvances(${Component.displayName ||
      Component.name})`;

    static propTypes = {
      [propName]: ProptTypes.number.isRequired,
      [`${propName}Increment`]: ProptTypes.func.isRequired,
      [upperBoundPropName]: ProptTypes.oneOfType([
        ProptTypes.number,
        ProptTypes.array,
      ]).isRequired,
    };

    static defaultProps = {
      autoAdvanceDelay: 10e3,
    };

    componentDidMount() {
      this.startTimer();
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps[propName] !== this.props[propName] ||
        prevProps[upperBoundPropName] !== this.props[upperBoundPropName]
      ) {
        this.startTimer();
      }
    }

    componentWillUnmount() {
      clearTimeout(this._timer);
    }

    startTimer() {
      clearTimeout(this._timer);
      if (!this.props.autoAdvanceDelay) return;

      let upperBound;
      if (typeof this.props[upperBoundPropName] === 'number') {
        upperBound = this.props[upperBoundPropName];
      } else if (this.props[upperBoundPropName] != null) {
        upperBound = this.props[upperBoundPropName].length;
      }

      this._timer = setTimeout(() => {
        this.props[`${propName}Increment`](upperBound);
      }, this.props.autoAdvanceDelay);
    }

    render() {
      const { autoAdvanceDelay: _autoAdvanceDelay, ...rest } = this.props;
      return <Component {...rest} />;
    }
  };
