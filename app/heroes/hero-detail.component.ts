import {Component, Input} from '@angular/core';
import { Hero } from './hero';

@Component({
    selector: 'my-hero-detail',
    templateUrl: 'app/heroes/hero.view.html'
})

export class HeroDetailComponent {
    @Input()
    hero: Hero;
}