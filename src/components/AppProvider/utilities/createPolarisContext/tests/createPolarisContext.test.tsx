import * as React from 'react';
import {noop} from '@shopify/javascript-utilities/other';
import Intl from '../../Intl';
import {StickyManager} from '../../withSticky';
import Link from '../../Link';
import ScrollLockManager from '../../ScrollLockManager';
import createPolarisContext from '../createPolarisContext';

describe('createPolarisContext()', () => {
  it('returns the right context without arguments', () => {
    const context = createPolarisContext();
    const mockContext = {
      polaris: {
        intl: new Intl(undefined),
        link: new Link(),
        stickyManager: new StickyManager(),
        scrollLockManager: new ScrollLockManager(),
        subscribe: noop,
        unsubscribe: noop,
        appBridge: undefined,
      },
      polarisTheme: {
        logo: null,
        subscribe: noop,
        unsubscribe: noop,
      },
    };

    expect(context).toEqual(mockContext);
  });

  it('returns the right context with app provider and theme provider context provided', () => {
    const i18n = {
      Polaris: {
        Common: {
          undo: 'Custom Undo',
        },
      },
    };
    const CustomLinkComponent = () => {
      return <a href="test">Custom Link Component</a>;
    };
    const stickyManager = new StickyManager();
    const scrollLockManager = new ScrollLockManager();
    const mockSubscribe = (fn: () => void) =>
      ([] as Array<() => void>).push(fn);
    const mockUnsubscribe = (fn: () => void) =>
      [].filter((curFn: any) => curFn !== fn);
    const contextOne = createPolarisContext(
      {
        i18n,
        linkComponent: CustomLinkComponent,
        stickyManager,
      },
      {
        logo: null,
        subscribe: mockSubscribe,
        unsubscribe: mockUnsubscribe,
      },
    );
    const contextTwo = createPolarisContext(
      {
        logo: null,
        subscribe: mockSubscribe,
        unsubscribe: mockUnsubscribe,
      },
      {
        i18n,
        linkComponent: CustomLinkComponent,
        stickyManager,
      },
    );
    const mockContext = {
      polaris: {
        intl: new Intl(i18n),
        link: new Link(CustomLinkComponent),
        stickyManager,
        scrollLockManager,
        subscribe: noop,
        unsubscribe: noop,
        appBridge: undefined,
      },
      polarisTheme: {
        logo: null,
        subscribe: mockSubscribe,
        unsubscribe: mockUnsubscribe,
      },
    };

    expect(contextOne).toEqual(mockContext);
    expect(contextTwo).toEqual(mockContext);
  });

  it('returns the right context with only app provider context being provided', () => {
    const i18n = {
      Polaris: {
        Common: {
          undo: 'Custom Undo',
        },
      },
    };
    const CustomLinkComponent = () => {
      return <a href="test">Custom Link Component</a>;
    };
    const stickyManager = new StickyManager();
    const scrollLockManager = new ScrollLockManager();
    const context = createPolarisContext({
      i18n,
      linkComponent: CustomLinkComponent,
      stickyManager,
    });
    const mockContext = {
      polaris: {
        intl: new Intl(i18n),
        link: new Link(CustomLinkComponent),
        stickyManager,
        scrollLockManager,
        subscribe: noop,
        unsubscribe: noop,
        appBridge: undefined,
      },
      polarisTheme: {
        logo: null,
        subscribe: noop,
        unsubscribe: noop,
      },
    };

    expect(context).toEqual(mockContext);
  });

  it('returns the right context with only theme provider context being provided', () => {
    const mockSubscribe = (fn: () => void) =>
      ([] as Array<() => void>).push(fn);
    const mockUnsubscribe = (fn: () => void) =>
      [].filter((curFn: any) => curFn !== fn);
    const context = createPolarisContext({
      logo: null,
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
    });

    const mockContext = {
      polaris: {
        intl: new Intl(undefined),
        link: new Link(),
        stickyManager: new StickyManager(),
        scrollLockManager: new ScrollLockManager(),
        subscribe: noop,
        unsubscribe: noop,
        appBridge: undefined,
      },
      polarisTheme: {
        logo: null,
        subscribe: mockSubscribe,
        unsubscribe: mockUnsubscribe,
      },
    };

    expect(context).toEqual(mockContext);
  });
});
