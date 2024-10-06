import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:5173', // Frontend
      'https://desafio-fulllstack.onrender.com' // Produção
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // Adicione aqui os headers permitidos
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
