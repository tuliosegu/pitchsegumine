# SEGUMINE — Investor Pitch Site

Site estático pronto para publicar. Não requer build.

## Arquivos
- `index.html` — apresentação
- `styles.css` — visual e responsividade
- `app.js` — navegação, teclado, hash e tela cheia
- `assets/` — screenshots reais do produto
- `vercel.json` — configuração opcional da Vercel

## Testar localmente
Na pasta do projeto:

```bash
python3 -m http.server 8080
```

Acesse `http://localhost:8080/#slide-1`.

## Navegação
- ← / →: mudar slide
- Espaço / Enter: próximo
- Home / End: primeiro / último
- F: tela cheia
- URLs diretas funcionam: `#slide-1` a `#slide-7`

## Subdomínio sugerido
`segumine.msicapital.com.br`

## Publicação recomendada — Vercel
1. Crie um repositório GitHub e envie todo o conteúdo desta pasta para a raiz.
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. Framework Preset: **Other**. Build Command: deixe vazio. Output Directory: deixe vazio.
4. Publique.
5. Em **Settings → Domains**, adicione `segumine.msicapital.com.br`.
6. A Vercel mostrará o CNAME exato necessário. Copie-o.
7. No Registro.br, abra o domínio `msicapital.com.br` → **DNS → Editar Zona**.
8. Crie o registro `CNAME` com nome `segumine` e destino exatamente igual ao informado pela Vercel.
9. Não altere os nameservers do domínio e não mexa nos registros de e-mail.
10. Volte à Vercel e aguarde o status **Valid Configuration**. O HTTPS será emitido automaticamente.

> Se o Registro.br informar que a zona DNS é administrada por outro provedor, faça o CNAME nesse provedor, não no painel DNS do Registro.br.
