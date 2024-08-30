# Image Reader 🤖

#### back-end de um serviço de leitura de imagens com API Gemini Vision

Vamos desenvolver o back-end de um serviço que gerencia a leitura individualizada de
consumo de água e gás. Para facilitar a coleta da informação, o serviço utilizará IA para
obter a medição através da foto de um medidor

## Documentação da API

#### Retorna todos os itens

```http
  POST /upload
```

| Parâmetro          | Tipo               | Descrição |
| :----------------- | :----------------- | :-------- |
| `image`            | `base64`           | form-data |
| `customer_code`    | `string`           | body      |
| `measure_datetime` | `datetime`         | body      |
| `measure_type`     | `"WATER" ou "GAS"` | body      |

#### Retorna um item

[X] GEMINI_API_KEY=<chave da API>
[ ] A aplicação completamente dockerizada.
[ ] O docker-compose deve ser capaz de subir a aplicação e todos os serviços necessários com um único comando.
[ ]
