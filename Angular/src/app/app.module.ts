import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { QRCodeModule } from 'angularx-qrcode';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MenuComponent } from './shared/menu/menu.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactoComponent } from './contacto/contacto.component';
import { PreguntasComponent } from './preguntas/preguntas.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EstudianteComponent } from './estudiante/estudiante.component';
import { MaestroComponent } from './maestro/maestro.component';
import { GrupoComponent } from './grupo/grupo.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AdministradorComponent } from './administrador/administrador.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MessageService } from './services/message.service';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ContactoComponent,
    PreguntasComponent,
    EstudianteComponent,
    MaestroComponent,
    GrupoComponent,
    AdministradorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    QRCodeModule,
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
