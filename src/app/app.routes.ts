import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { RegisterComponent } from './pages/register/register.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home Page' },
  { path: 'home', redirectTo: '' },
  { path: 'products', component: ProductsComponent, title: 'Produto' },
  { path: 'products/:id', component: ProductDetailComponent, title: 'Detalhes sobre o produto' },
  { path: 'register', component: RegisterComponent, title: 'Registo' },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], title: 'Profile' },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard], title: 'Whishlist' },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard], title: 'Carrinho' },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], title: 'Admin' },
  { path: '**', component: NotfoundComponent, title: 'Page not found'}
];