import { Component, OnInit } from '@angular/core';
import { Produto } from '../../model/produto.type';
import { ProductService } from '../../services/product.service';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authentication.service';
import { WishlistService } from '../../services/wishlist.service';
import { CustomcurrencyPipe } from '../../pipes/customcurrency.pipe';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CustomcurrencyPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent implements OnInit {

  produtos: Produto[] = [];
  produtosVisiveis: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  imagemAtual: { [key: number]: string } = {};
  quantidadePorPagina: number = 6;
  paginaAtual: number = 0;
  tipoFiltro: string = 'Todos';
  corFiltro: string = 'Todos';
  filtros: { tipo_de_produto: string[]; cor: string[] } = {
    tipo_de_produto: [],
    cor: []
  };
  wishlist: number[] = [];
  userId!: number;

  constructor(private productservice: ProductService, private wishlistService: WishlistService, private authService: AuthService, private cartService: CartService, private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.loadAllProducts();
    if (this.authService.isLoggedIn()) {
      this.userId = this.authService.getLoggedUserId()!;
      this.loadWishlist();
    }
  }

  loadAllProducts() {
    this.productservice.getAll().subscribe((products) => {
      this.produtos = products;
      this.produtosFiltrados = products;
      this.carregarFiltros();
      this.atualizarProdutosVisiveis();
    });
  }

  trocarImagem(produtoId: number, novaImagem: string): void {
    this.imagemAtual[produtoId] = novaImagem;
  }

  carregarFiltros() {
    this.filtros.tipo_de_produto = Array.from(
      new Set(this.produtos.map((produto) => produto.tipo_de_produto))
    ).sort();
    this.filtros.cor = Array.from(
      new Set(this.produtos.map((produto) => produto.cor))
    ).sort();
  }

  aplicarFiltros() {
    this.produtosFiltrados = this.produtos.filter((produto) => {
      const tipoCondicao = this.tipoFiltro === 'Todos' || produto.tipo_de_produto === this.tipoFiltro;
      const corCondicao = this.corFiltro === 'Todos' || produto.cor === this.corFiltro;
      return tipoCondicao && corCondicao;
    });

    this.paginaAtual = 0;
    this.atualizarProdutosVisiveis();
  }

  atualizarProdutosVisiveis() {
    const inicio = this.paginaAtual * this.quantidadePorPagina;
    const fim = inicio + this.quantidadePorPagina;
    this.produtosVisiveis = this.produtosFiltrados.slice(inicio, fim);
  }

  verMais() {
    this.paginaAtual++;
    this.atualizarProdutosVisiveis();
  }

  temMaisProdutos(): boolean {
    const proximoInicio = (this.paginaAtual + 1) * this.quantidadePorPagina;
    return proximoInicio < this.produtosFiltrados.length;
  }

  proximaPagina() {
    if (this.temProximaPagina()) {
      this.paginaAtual++;
      this.atualizarProdutosVisiveis();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.atualizarProdutosVisiveis();
    }
  }

  temProximaPagina(): boolean {
    const proximoInicio = (this.paginaAtual + 1) * this.quantidadePorPagina;
    return proximoInicio < this.produtosFiltrados.length;
  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  loadWishlist() {
    this.wishlistService.getWishlist(this.userId).subscribe(
      (wishlist) => {
        this.wishlist = wishlist;
      },
      (error) => {
        console.error('Erro ao carregar wishlist', error);
      }
    );
  }

  toggleWishlist(produtoId: number) {
    console.log(`Toggling wishlist for product ID: ${produtoId}`);
    if (this.isInWishlist(produtoId)) {
      this.wishlistService.removeFromWishlist(this.userId, produtoId).subscribe(() => {
        this.wishlist = this.wishlist.filter(id => id !== produtoId);
        console.log("Produto removido da wishlist"); // Log de depuração
        alert("Produto removido da wishlist");
      });
    } else {
      this.wishlistService.addToWishlist(this.userId, produtoId).subscribe(() => {
        this.wishlist.push(produtoId);
        console.log("Produto adicionado à wishlist"); // Log de depuração
        alert("Produto adicionado à wishlist");
      });
    }
  }

  isInWishlist(produtoId: number): boolean {
    return this.wishlist.includes(produtoId);
  }

  adicionarAoCarrinho(produto: Produto) {
    const message = this.cartService.addToCart(produto);
    alert(message);
  }

  voltar(): void {
    this.location.back();
  }
}