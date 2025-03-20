import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // מאפשר ל-Frontend לגשת ל-Backend
  app.enableCors({
    origin: 'http://localhost:3001', // מתיר גישה רק מ-Frontend שרץ על פורט 3001
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // אם אתה שולח עוגיות (Cookies) או Authentication Headers
  });

  await app.listen(3000);
  console.log('🚀 Backend is running on http://localhost:3000');
}
bootstrap();
