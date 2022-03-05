# Solana Clicker

Solana Clicker is a simple game where you click on the screen to earn money. It is an experiment to see how the Solana ecosystem can be used to build a blockchain-based game.

It was built as a part of Solana [Prague Hacker House 2022](https://lu.ma/prague-hacker-house).

## Contract

The contract code is in the `contract/` directory. It is built on Anchor framework.

The contract interacts with two game tokens, the currency token and the upgrade token.

It allows you to mint the currency token, in the basic state at one token per transactions.
You can exchange the currency token for upgrade tokens, which you can use to mint multiple tokens per transactions. The price of the upgrade tokens increases gradually.

## Frontend

The frontend is based on Next.js, a production-ready React Framework. To run the project yourslef, you need to run:

```
yarn install
yarn run dev
```

## Authors

- Tomas Martykan ([GitHub](https://github.com/martykan), [LinkedIn](https://www.linkedin.com/in/tomas-martykan/))
- Dominik Vit ([GitHub](https://github.com/), [LinkedIn](https://www.linkedin.com/in/dominik-v%C3%ADt-70a1a6184/))
