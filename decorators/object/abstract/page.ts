import { oh } from '../../helpers';
import { AbstractObject, AbstractObjectInitOpts } from './object';
import { IImplementable } from '../core';
import { InitMode } from '../core/iConstructor';
import { internal } from '../core/shared';

export abstract class AbstractPage<I extends AbstractObjectInitOpts = AbstractObjectInitOpts> extends AbstractObject<I> {
  @internal public defaultPageUri: string;
  constructor(defaultPageUri?: string, element: IImplementable = null) { super(element); this.defaultPageUri = defaultPageUri; }

  @internal public async navigateToPage(uri?: string): Promise<this> {
    await oh.get(uri || this.defaultPageUri);
    return this;
  }
}
