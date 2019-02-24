import React, { useContext, useRef, useEffect } from 'react';
import { css, cx } from 'emotion';
import gql from 'graphql-tag';

import * as GraphQLTypes from '../graphqlTypes';
import Rating from './Rating';
import InteractionStateContainer from '../InteractionStateContainer';

export const ResultItemBusinessFragment = gql`
  fragment ResultItemBusinessFragment on Business {
    id
    name
    photos
    review_count
    rating
    price
    categories {
      title
    }
  }
`;

function isElementInViewport(element: HTMLElement) {
  var rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const buttonOverrideStyles = css`
  text-align: left;
  appearance: initial;
  border: 0;
  padding: 0;
  display: block;
`;

const ResultItem: React.FunctionComponent<{
  business: GraphQLTypes.ResultItemBusinessFragment;
}> = ({ business }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const {
    businessIdInFocus,
    focusTriggerSource,
    focusOnBusinessId,
    selectedBusinessId,
    setSelectedBusinessId,
  } = useContext(InteractionStateContainer.Context);
  useEffect(() => {
    if (
      businessIdInFocus === business.id &&
      focusTriggerSource !== 'list' &&
      ref.current &&
      !isElementInViewport(ref.current)
    ) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [businessIdInFocus, focusTriggerSource]);

  return (
    <button
      ref={ref}
      className={cx(
        buttonOverrideStyles,
        css`
          display: flex;
          height: 110px;
          overflow-y: hidden;
          &:nth-of-type(even) {
            background-color: #f9f9f9;
          }
          &:nth-of-type(odd) {
            background-color: #ffffff;
          }
          &:hover,
          &:focus {
            background-color: #fffff0;
          }

          transition: 0.1s filter;
          filter: grayscale(0);
        `,
        businessIdInFocus === business.id &&
          focusTriggerSource === 'map' &&
          css`
            position: relative;
            z-index: 2;
            box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.2);
          `,
        businessIdInFocus &&
          businessIdInFocus !== business.id &&
          focusTriggerSource === 'map' &&
          css`
            filter: grayscale(1);
          `
      )}
      onMouseEnter={() => focusOnBusinessId(business.id, 'list')}
      onMouseLeave={() => focusOnBusinessId(null, 'list')}
      onFocus={() => focusOnBusinessId(business.id, 'list')}
      onClick={() => setSelectedBusinessId(business.id)}
    >
      <div
        className={css`
          width: 110px;
          height: 110px;
          background: #f0f0f0;
          flex-shrink: 0;
          ${business.photos &&
            css`
              background-image: url('${business.photos[0]}');
              background-size: cover;
              background-position: center;
            `}
        `}
      />
      <div
        className={css`
          display: flex;
          flex-direction: column;
          margin: 10px;
        `}
      >
        <h3
          className={css`
            margin-top: 0.2em;
            margin-bottom: 0.2em;
          `}
        >
          {business.name}
        </h3>

        {business.rating && (
          <span
            className={css`
              display: flex;
              align-items: center;
              flex-shrink: 0;
            `}
          >
            <Rating rating={business.rating} />
            <span
              className={css`
                margin-left: 0.5em;
                font-size: 14px;
              `}
            >
              {business.review_count} reviews
            </span>
          </span>
        )}

        <div
          className={css`
            margin-top: 0.2em;
            font-size: 14px;
            color: #666;
          `}
        >
          {business.price} -{' '}
          {(business.categories || [])
            .map(category => category && category.title)
            .join(', ')}
        </div>
      </div>
    </button>
  );
};

export default ResultItem;
