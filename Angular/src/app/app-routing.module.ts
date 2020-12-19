import { AdministradorComponent } from './administrador/administrador.component';
import { EstudianteComponent } from './estudiante/estudiante.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from './contacto/contacto.component';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { MaestroComponent } from './maestro/maestro.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'preguntas', component: PreguntasComponent},
  { path: 'contacto', component: ContactoComponent},
  { path: 'estudiante', component: EstudianteComponent},
  { path: 'administrador', component: AdministradorComponent },
  { path: 'maestro', component: MaestroComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
