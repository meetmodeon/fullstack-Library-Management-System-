import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { LoginComponent } from './core/auth/login/login.component';
import { HeaderComponent } from './core/page/header/header/header.component';
import { HomeComponent } from './core/page/home/home.component';
import { DashboardComponent } from './core/page/dashboard/dashboard.component';
import { LoginCallbackComponent } from './core/auth/login-callback/login-callback.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:"home",
        pathMatch:"full"
    },
    {
        path:"home",
        component:HomeComponent
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"header",
        component:HeaderComponent
    },
    {
        path:"dashboard",
        component:DashboardComponent
    },
    {
        path:'login-callback',
        component:LoginCallbackComponent
    },
    {
        path:'admin',
        children:[
            {
                path:"register",
                loadComponent:()=>
                    import('./core/auth/register/register.component').then(m=>m.RegisterComponent)
            },
            {
                path:"dashboard",
                loadComponent:()=>
                    import('./core/superAdmin/page/dashboard/dashboard.component').then(m=>m.DashboardComponent)
            }
        ]
    }
];
