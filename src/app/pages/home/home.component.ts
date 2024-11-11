import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { FeaturedproductsComponent } from '../../components/featuredproducts/featuredproducts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CarouselComponent, FeaturedproductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
