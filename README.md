# ARTUR CHEATS

Painel web responsivo em **azul-marinho**, com login por key, gerador de sensibilidade, histórico e favoritos, área Auxílio, suporte via Discord e painel administrativo.

## Desenvolver e validar

```bash
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm check
pnpm test
pnpm build
```

## Identidade e acesso administrativo

O painel identifica o administrador como `ARTURADMIN00`. A chave usada para autenticar o administrador é configurada separadamente pela variável privada `RBXIS_ADMIN_KEY`; não a grave neste repositório público. O segredo de sessão também é obrigatório.

## Deploy na Vercel

Importe este repositório na Vercel e configure estas variáveis de ambiente em todos os ambientes necessários:

- `RBXIS_ADMIN_KEY`: chave privada e exclusiva para o login administrativo. O padrão desta cópia é `ARTDMIN23K`; altere a variável na Vercel para uma chave privada própria.
- `RBXIS_SESSION_SECRET`: segredo aleatório longo. Gere um valor novo com `openssl rand -hex 32`.
- `MOCKAPI_KEYS_URL`: `https://6ade7e8b4e88f1bba4a527ee.mockapi.io/Arturapi`.

Não inclua valores de segredo em commits, issues públicas ou arquivos de ambiente publicados.

## MockAPI

A coleção de licenças usa `https://6ade7e8b4e88f1bba4a527ee.mockapi.io/Arturapi`. Se a coleção exigir schema fixo, disponibilize estes campos:

| Campo | Tipo | Uso |
|---|---|---|
| `key` | String | Credencial gerada |
| `username` | String | Usuário associado à key |
| `used` | Boolean | Indica ativação |
| `device` | String | HWID vinculado |
| `expire` | Number | Duração da licença |
| `type` | String | Plano, como `daily`, `weekly`, `hourly` ou `perm` |
| `createdAt` | Number | Data de criação em Unix seconds |
| `activatedAt` | Number | Primeira ativação em Unix seconds |
| `expiresAt` | Number | Expiração em Unix seconds |
| `status` | String | `active`, `revoked` ou `blocked` |
| `onlineAt` | Number | Última atividade em Unix seconds |
| `history` | Array/Object | Histórico e favoritos do gerador |

O campo `id` pode ser criado pela MockAPI. As keys novas usam o prefixo `ARTUR-`.

## Discord

O botão **Discord** na tela de login e a página Sobre direcionam para [discord.gg/TYSCkr9y3j](https://discord.gg/TYSCkr9y3j).

## Ativos visuais

A logo principal foi fornecida para este projeto. Os ícones de código da interface são renderizados pelo pacote Lucide usado pela aplicação.

## PWA

O título, tema e manifesto de instalação estão configurados para ARTUR CHEATS. Para atualizar uma instalação antiga no celular após o deploy, feche e reabra o PWA; se o cache persistir, remova o atalho antigo e adicione-o novamente pelo navegador.
