import MercadoPagoConfig from "mercadopago";

// configuro mercado pago aqui a el acces toke de prueba
export const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000, idempotencyKey: "abc" },
});

console.log(client.accessToken)
