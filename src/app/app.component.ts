import { Component } from '@angular/core';
import { CardData } from './models/card-data.model';
import { RestartDialogComponent } from './restart-dialog/restart-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cardImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Semjen_Zsolt_portre.jpg/200px-Semjen_Zsolt_portre.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Kov%C3%A1cs_Gergely_2017-ben_%28cropped%29.jpg/250px-Kov%C3%A1cs_Gergely_2017-ben_%28cropped%29.jpg',
    'https://2015-2019.kormany.hu/download/2/36/91000/tn231c0.jpg',
    'https://2015-2019.kormany.hu/download/3/26/61000/tn231c0.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ferenc_Gyurcs%C3%A1ny%2C_Davos_2.jpg/250px-Ferenc_Gyurcs%C3%A1ny%2C_Davos_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Th%C3%BCrmer_Gyula_2018.01.22.jpg/250px-Th%C3%BCrmer_Gyula_2018.01.22.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Torgy%C3%A1n_J%C3%B3zsef_-_2016_%28crop%29.jpg/250px-Torgy%C3%A1n_J%C3%B3zsef_-_2016_%28crop%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Istv%C3%A1n_Csurka_cropped.jpg/398px-Istv%C3%A1n_Csurka_cropped.jpg',
    'https://nepszava.us/wp-content/uploads/2021/10/vakkomondor.jpg',
    'https://assets.4cdn.hu/kraken/7GyObHMUtl1oFUBcs.jpeg'
  ];

  cards: CardData[] = [];

  flippedCards: CardData[] = [];

  matchedCount = 0;

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.setupCards();
  }

  setupCards(): void {
    this.cards = [];
    this.cardImages.forEach((image, index) => {
      const cardData: CardData = {
        imageId: index,
        url: image,
        state: 'default'
      };

      this.cards.push({ ...cardData });
      this.cards.push({ ...cardData });

    });

    this.cards = this.shuffleArray(this.cards);
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();

    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];

      if (nextState === 'matched') {
        this.matchedCount++;

        if (this.matchedCount === this.cardImages.length) {
          const dialogRef = this.dialog.open(RestartDialogComponent, {
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(() => {
            this.restart();
          });
        }
      }

    }, 1000);
  }

  restart(): void {
    this.matchedCount = 0;
    this.setupCards();
  }

}
