import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/authentication.service';
import { RouterLink } from '@angular/router';
import { CustomcurrencyPipe } from '../../pipes/customcurrency.pipe';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomcurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistProdutos: any[] = [];
  utilizadorId: number;
  imagemAtual: { [key: number]: string } = {};


  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private location: Location
  ) {
    this.utilizadorId = this.authService.getLoggedUserId()!;
  }

  ngOnInit() {
    this.carregarWishlist();
  }

  carregarWishlist() {
    this.wishlistService.getWishlistProdutos(this.utilizadorId).subscribe((produtos) => {
      this.wishlistProdutos = produtos;
    });
  }

  confirmarRemocao(produtoId: number) {
    if (confirm('Tem certeza que deseja remover este produto da wishlist?')) {
      this.removerDaWishlist(produtoId);
    }
  }

  removerDaWishlist(produtoId: number) {
    this.wishlistService.removeFromWishlist(this.utilizadorId, produtoId).subscribe(() => {
      this.wishlistProdutos = this.wishlistProdutos.filter(produto => produto.id !== produtoId);
      alert("Produto removido da wishlist");
    });
  }

  adicionarAoCarrinho(produto: any) {
    const mensagem = this.cartService.addToCart(produto);
    alert(mensagem);
    this.removerDaWishlist(produto.id);
  }

  trocarImagem(produtoId: number, novaImagem: string): void {
    this.imagemAtual[produtoId] = novaImagem;
  }

  voltar(): void {
    this.location.back();
  }
}