import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Produto } from '../../model/produto.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featuredproducts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featuredproducts.component.html',
  styleUrl: './featuredproducts.component.css'
})

export class FeaturedproductsComponent implements OnInit {
  featuredProducts: Produto[] = [];
  hoveredProductId: number | null = null;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadFeaturedproducts();
  }

  private loadFeaturedproducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.featuredProducts = products.filter(product => product.isFeatured);
      },
      error: (err) => console.error("Erro ao carregar os produtos:", err)
    });
  }

  goToProductPage(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}