use anchor_lang::prelude::*;
use anchor_spl::{self, associated_token::{AssociatedToken}, token::{self, Mint, TokenAccount, Token, Burn}};

declare_id!("7G4gVE1Besvc4A2d5d9TzeAJZmPbez2EHNd7WGvNxqPX");

#[program]
pub mod airdrop_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, currency_mint_key: Pubkey, upgrade_mint_key: Pubkey) -> Result<()> {
        let authority = &mut ctx.accounts.authority;
        authority.bump = 0;
        authority.currency_mint_key = [currency_mint_key];
        authority.upgrade_mint_key = [upgrade_mint_key];
        Ok(())
    }

    pub fn airdrop(ctx: Context<Airdrop>) -> Result<()> {
        // Check if the correct mint is set
        if ctx.accounts.authority.currency_mint_key[0] != ctx.accounts.currency_mint.key() {
            return Err(error!(ErrorCode::IncorrectMintKey))
        }
        // Generate PDA
        let (authority, authority_bump) = Pubkey::find_program_address(&[b"sneed".as_ref()], ctx.program_id);
        let authority_seeds = &[b"sneed".as_ref(), &[authority_bump]];
        // Send mint CPI
        let mint_to_ctx = token::MintTo {
            mint: ctx.accounts.currency_mint.to_account_info(),
            to: ctx.accounts.currency_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        return token::mint_to(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), mint_to_ctx)
                .with_signer(&[&authority_seeds[..]]), 
            1
        );
    }

    pub fn airdrop_with_upgrade(ctx: Context<AirdropWithUpgrade>, upgrade_balance: u64) -> Result<()> {
        // Check if the correct mint is set
        if ctx.accounts.authority.currency_mint_key[0] != ctx.accounts.currency_mint.key() ||
           ctx.accounts.authority.upgrade_mint_key[0] != ctx.accounts.upgrade_mint.key() {
            return Err(error!(ErrorCode::IncorrectMintKey))
        }
        // Calculate upgraded amount
        let amount = 1 + upgrade_balance;
        // Generate PDA
        let (authority, authority_bump) = Pubkey::find_program_address(&[b"sneed".as_ref()], ctx.program_id);
        let authority_seeds = &[b"sneed".as_ref(), &[authority_bump]];
        // Send mint CPI
        let mint_to_ctx = token::MintTo {
            mint: ctx.accounts.currency_mint.to_account_info(),
            to: ctx.accounts.currency_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        return token::mint_to(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), mint_to_ctx)
                .with_signer(&[&authority_seeds[..]]), 
            amount
        );
    }

    pub fn buy_upgrade(ctx: Context<AirdropWithUpgrade>, upgrade_balance: u64) -> Result<()> {
        // Check if the correct mint is set
        if ctx.accounts.authority.currency_mint_key[0] != ctx.accounts.currency_mint.key() ||
           ctx.accounts.authority.upgrade_mint_key[0] != ctx.accounts.upgrade_mint.key() {
            return Err(error!(ErrorCode::IncorrectMintKey))
        }

        let price = 50 + 50*upgrade_balance.pow(2);
        let amount = 1;

        // Burn currency token
        let burn_ctx = token::Burn {
            mint: ctx.accounts.currency_mint.to_account_info(),
            to: ctx.accounts.currency_account.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        };
        token::burn(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), burn_ctx),
            price
        );

        // Mint upgrade token
        let (authority, authority_bump) = Pubkey::find_program_address(&[b"sneed".as_ref()], ctx.program_id);
        let authority_seeds = &[b"sneed".as_ref(), &[authority_bump]];
        // Send mint CPI
        let mint_to_ctx = token::MintTo {
            mint: ctx.accounts.upgrade_mint.to_account_info(),
            to: ctx.accounts.upgrade_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        return token::mint_to(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), mint_to_ctx)
                .with_signer(&[&authority_seeds[..]]), 
            amount
        );
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      init,
      seeds = [b"sneed".as_ref()],
      bump,
      payer = signer,
    )]
    pub authority: Account<'info, SetupAccount>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Airdrop<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub authority: Account<'info, SetupAccount>,

    #[account(mut)]
    pub currency_mint: Account<'info, Mint>,

    #[account(mut, associated_token::mint = currency_mint, associated_token::authority = signer)]
    pub currency_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(upgrade_balance: u64)]
pub struct AirdropWithUpgrade<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub authority: Account<'info, SetupAccount>,

    #[account(mut)]
    pub currency_mint: Account<'info, Mint>,

    #[account(mut, associated_token::mint = currency_mint, associated_token::authority = signer)]
    pub currency_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub upgrade_mint: Account<'info, Mint>,

    #[account(
        mut, 
        associated_token::mint = upgrade_mint, 
        associated_token::authority = signer, 
        constraint = upgrade_account.amount >= upgrade_balance
    )]
    pub upgrade_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct SetupAccount {
    pub bump: u8,
    pub currency_mint_key: [Pubkey; 1],
    pub upgrade_mint_key: [Pubkey; 1],
}

#[error_code]
pub enum ErrorCode {
    #[msg(""Upgrade mint key does not match authority key"")]
    IncorrectMintKey,
}