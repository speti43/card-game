import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CardData } from '../models/card-data.model';

export interface CardState {
  card: CardData[];
}

const defaultState: CardState = {
  card: [],
};

@Injectable()
export class CardStore extends ComponentStore<CardState> {
  constructor() {
    super(defaultState);
  }

  readonly card$ = this.select(({ card: card }) => card);

  readonly loadCard = this.updater((state, card: CardData[] | null) => ({
    ...state,
    card: card || [],
  }));
}