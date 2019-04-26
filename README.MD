## Antes de Iniciar

1. Instalar e iniciar o Visual Studio Code: https://code.visualstudio.com/download

2. Instalar e ativar as extensões mínimas necessárias
  - Azure Account: https://github.com/microsoft/vscode-azure-account
  - Azure Functions: https://github.com/Microsoft/vscode-azurefunctions
   
3. No Visual Studio Code, acessar a aba do Azure e efetuar login para acessar suas assinaturas
![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/01-azuresignin.png)

## Criando o Projeto

4. Após o login, escolher a assinatura desejada e clicar em "Create New Project..."
  - Selecionar a pasta onde será criado o projeto
  ![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/02-createnewproject.png)

  - Selecionar a linguagem Typescript
  ![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/03-newproject-typescript.png)

  - Selecionar o template (eg HttpTrigger)
  ![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/04-newproject-template.png)

  - Especificar o nome de função (eg Thumbnail Image)
  - Definir Authorization Level (eg Function)

5. Analise o projeto criado
  - Estrutura do Projeto:
  ![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/05-newproject-createdproject.png)

6. Em package.json, incluir a dependência "image-thumbnail" na propriedade "dependencies: 
```javascript
"dependencies": {
  "image-thumbnail": "1.0.2"
}
```

7. Alterar o código da função em si. abrir o arquivo "ThumbnailImage/index.ts" e alterar incluindo o seguinte conteúdo:

```javascript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as imageThumbnail from 'image-thumbnail';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const imageUrl = (req.query.imageUrl || (req.body && req.body.imageUrl));    

    try {
        if (imageUrl) {
            let options = { responseType: 'base64' }
            const thumbnail = await imageThumbnail({ uri: imageUrl }, options);            
            
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: thumbnail
            };
        }
        else {
            context.res = {
                status: 400,
                body: "Please pass a image URL to get the thumbnail"
            };
        }
    }
    catch (err) {
        console.error(err);
        context.res = {
            status: 500,
            body: err
        };
    }
};

export default httpTrigger;
```

![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/07-thumbnailimage-indexcode.png)

8. Executar a função na máquina local. Para isso, acesse a aba de Debug e execute a configuração já existente "Attach to Node Functions":

![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/08-thumbnailimage-debug.png)

 - Este procedimento já irá instalar os pacotes NPM, fazer a compilação do Typescript e executar a função no host local

 - Ao término da execução, será disponibilizado acesso a função via URL local (eg http://localhost:7071/api/ThumbnailImage)

![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/09-thumbnailimage-running.png)

 9. Abrir o Postman ou outra ferramenta para testes de APIs para testar a função recém criada.
  - Incluir no body da requisição a URL de uma imagem, especificando como content type "application/json":
```javascript
{
    "imageUrl": "https://cdn.pixabay.com/photo/2016/04/15/04/02/water-1330252__340.jpg"
}
```

10. A função deverá retornar o base64 da imagem conforme programado na função:

![Azure Tools](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/10-thumbnailimage-response.png)

11. Funcionou! Podemos agora interromper a execução.

## Publicando no Azure

12. Agora vamos publicar esta função no Azure. Voltando para a aba azure, escolha a assinatura desejada e então escolha a opção "Create Function app In Azure"

![Create Function App](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/11-azure-createfunctionapp.png)

 - Especificar um nome único. Será criada uma função em um grupo de recursos novo definido pela extensão.
 - Para visualizar a nova função criada, acesse seu menu de contexto e seleciona aopção "Open in Portal"

![Open Function App in Portal](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/12-azure-createfunctionapp-openinportal.png)

![Azure Function in Portal](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/13-azure-functionapp-azureportal.png)

13. Agora vamos fazer o deploy da nossa função local no azure escolhendo a opção "Deploy to Funcation App..." do menu de contexto da função.

![Azure Function Deploy](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/14-azure-functionapp-deploy.png)

  - Confirmar o deploy da função

14. Acessar novamente o portal para verificar a função que acaba de ser implantada:
  
![Azure Function Deployed](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/15-azure-functionapp-deployed.png)

15. Testar usando o mesmo Postman, mas agora apontando para a URL da função no azure. 

16. Em alguns casos pode ser retornado erro 500. Seguem passos para analisar erro e corrigir:

 - No VSCode, clicar na opção "Start Streaming Logs" da função no Azure através dessa opção no menu de contexto:

![Start Stream Logs](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/16-vscode-functionapp-startstreamlogs.png)

 - Testar novamente a função no Postman. Será retornado o erro:

![Error Logs](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/17-vscode-functionapp-errorlogs.png)

 - Note que esse erro em questão diz respeito a versão do Node sendo usada no host da Function no Azure. Para corrigir esse erro, é necessário especificar NodeJS 64 bits no host da função no Azure.

 - Acesse o Kudu do host do Azure Function:

![Kudu do Azure Function](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/18-azure-functionapp-accesskudu.png)

 - Acesse o Debug Console CMD

 - Arraste o executável no Node 64 bits na pasta d:\home

![Upload Node](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/19-azure-functionapp-uploadnode.png)

 - Voltando para o Azure Function, acessar App Settings e incluir a seguinte configuração:

languageWorkers:node:defaultExecutablePath = d:\home\node
![App Settings](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/20-azure-functionapp-appsettings.png)

 - Agora vamos testar novamente a função e Voialá!

![Azure Function Funcionando](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/21-azure-functionapp-workingtest.png)

## Incluindo Testes

17. Pronto! Agora vamos incluir alguns testes para nossa função. Para isso, vamos incluir nova dependencia de desenvolvimento no package.json. No final, nosso devDependencies ficará da seguinte forma:

```javascript
  "devDependencies": {
    "@azure/functions": "^1.0.1-beta2",
    "@types/jest": "^24.0.11",
    "jest": "^24.7.1",
    "ts-jest": "^24.0.2",
    "typescript": "^3.3.3"
  }
```

  - Atualizar também a Task de teste para:
```javascript
  "test": "jest"
```

18. Adicionar novo arquivo chamado index.test.ts na pasta da função:

```javascript
/**
 * @jest-environment node
 */

 import * as httpTrigger from './index';

test('Http trigger should receive a imageUrl', async () => {

    const context: any = {
        log: jest.fn()
    };

    const request = {
        query: { name: 'Bill' }
    };

    await httpTrigger.default(context, request);

    expect(context.log.mock.calls.length).toBe(1);
    expect(context.res.body).toEqual('Please pass a image URL to get the thumbnail');
});

test('Http trigger should return thumbnail image', async () => {

    const context: any = {
        log: jest.fn()
    };

    let imageUrl: string = "https://cdn.pixabay.com/photo/2016/04/15/04/02/water-1330252__340.jpg";
    let imageThumbnail: string = "/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAiADcDASIAAhEBAxEB/8QAGwAAAwEAAwEAAAAAAAAAAAAAAAUGBAECAwf/xAArEAACAQMDAwMCBwAAAAAAAAABAgMABBEFEiETMVEyQWEigRQkQnGhwdH/xAAaAQACAwEBAAAAAAAAAAAAAAAEBQIDBgAB/8QAIBEAAgMBAAICAwAAAAAAAAAAAQIAAxEEEjEhMgUTFP/aAAwDAQACEQMRAD8A+k2sqRAbg2R8inVrqKKAAAT8mom2Fx0+oW7c4JrYs05h6olRFz22/wB1qLOXTMNV+SCruyl1TUcw+rk9gOajNbM8q5ZmKHvhRxTq2nQBWuo1bH6jJj+K2NqNiCFYDYfSDH/tSqT9R+F2L+3s/oGFwJN6Np1u+wJdL1iM7QucfGaoJIGsoSxlY8eynNeJ1a0iUmIRoSeCErBda/KVMZVgpHBx3HmrHre07kr5uxKFwNsRavfF59g3nyAM0V56jFdyOJbddyNzuPGaKMSlQIJZ3OzbHNi8MgXegIB4plMlvMY0lyqrzhTwakLK9Quozj2qjtLqNWDFlbPGPHzXX0lTogtV5zxaPY7a0kKTdNCw7NXF2IrgCOSNX2nK7uB9q6QsuzsBR+JjQhJAEbx8eaX4djAlcw4NmBoLWFmzsDAYYBSwA81z+WdcLsk2/Tkg8V2e9SLerHeme4x2pbqeqw26FfpTxRKI7nIL5og+MmXVFl3jZtA9gBRSm91WJQCJBgnsaKZJWwXMgLKznyAMT6Z6vtT+AnPfxRRVlsj1faOy7jZhm9I9/isLsfo5PoNFFAV+57d6EVXbERNgnv5qf1JmMfLE8+f3oopjXJ8n2ER3DHp9zRRRVsep6n//2Q==";
    const request = {
        query: { imageUrl: imageUrl }
    };

    await httpTrigger.default(context, request);

    expect(context.log.mock.calls.length).toBe(1);
    expect(context.res.body).toEqual(imageThumbnail);
});
```

![Create Test](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/22-vscode-functionapp-createtest.png)

19. Feito isso, vamos incluir o arquivo de configuração do jest na raiz do projeto:

```javascript
  module.exports = {
    "roots": [
      "<rootDir>/ThumbnailImage"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    "testEnvironment": "node",
  }
```

20. Feito isso, instalar os novos pacotes com "npm install" e depois executar o script de teste com "npm run test"

![Run Test](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/23-vscode-functionapp-runtest.png)

 - Note que no teste estamos verificando o resultado base64 do thumbnail da imagem. Podemos incluir outras imagens e outros testes para verificar nossa função.

## Integração Contínua

21. Está tudo pronto. O próximo passo é criar um projeto no Azure Devops para realizar a integração e entrega contínua do projeto.

22. Acesse o site https://devops.azure.com e forneça suas credenciais de acesso.

23. Clique na opção para criar novo projeto:

![Azure Devops New Project](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/24-devops-createnewproject.png)

24. Você pode neste momento importar o projeto do GitHub para o repositório dentro do Azure Devops ou simplesmente manter seu código somente no GitHub. Se desejar importar o código, acessar o item "Repos" no menu e então escolher a opção "Import Repository", fornecendo as informações e credenciais do seu repositório no Git Hub.

![Importing GitHub Repository](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/25-devops-importrepos.png)

25. Agora acesse a item Pipelines > Builds e clique no botão para criar um novo pipeline de build (New Pipeline)

![New Build Pipeline](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/26-devops-newbuildpipeline.png)

26. Você pode optar por obter o código do repositório do Azure Devops ou diretamente do GitHub e de outras fontes. Vou escolher a opção "GitHub". 

- Você precisa autorizar acesso ao Github via OAuth

- Depois, você deve selecionar o repositório

27. Na hora de selecionar o template, você pode optar por escolher o Yaml ou diretamente um template pronto.

- Yaml:

```yaml
pool:
  name: Hosted
#Your build pipeline references an undefined variable named ‘which node.exe’. Create or edit the build pipeline for this YAML file, define the variable on the Variables tab. See https://go.microsoft.com/fwlink/?linkid=865972

steps:
- task: NodeTool@0
  displayName: 'Use Node version 10.14.1'
  inputs:
    versionSpec: 10.14.1

- task: Npm@1
  displayName: 'Install Application Dependencies'
  inputs:
    workingDir: '$(System.DefaultWorkingDirectory)'
    verbose: false

- task: Npm@1
  displayName: 'Run ''build' script'
  inputs:
    command: custom
    verbose: false
    customCommand: 'run build --if-present'

- task: Npm@1
  displayName: 'Remove extraneous packages'
  inputs:
    command: custom
    verbose: false
    customCommand: 'prune --production'

- bash: 'cp "$(which node.exe)" .'
  displayName: 'Bash Script'

- task: ArchiveFiles@2
  displayName: 'Archive files'
  inputs:
    rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
    includeRootFolder: false

- task: PublishBuildArtifacts@1
  displayName: 'Publish Artifact: drop'
```

- Template "Azure Functions for Node.js"

![Build Pipeline Template](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/27-devops-buildpipelinetemplate.png)

28. Especificar o Source e o Agent Pool. No meu caso, vou especificar o "Hosted"

29. Agora vamos tratar o problema do Node.JS 64 bits do Azure. Inclua a task "Bash Script" antes do "Archive Files" para copiar o executável do node na pasta do resultado de build que será emcacotada:

![Bash Script](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/28-devops-bashscript.png)

30. Adicionalmente você pode cinluir um triger para realizar o build automaticamente após novo commit.

31. Terminada a configuração, você pode disparar tanto manualmente como através do trigger o novo build.

## Entrega Contínua

32. Feito o Pipeline de Build, o próximo passo é criar o pipeline de release.

33. Acesse a item Pipelines > Releases e clique no botão para criar um novo pipeline de release (New Pipeline)

34. Escolha o template "Deploy a function app to Azure Functions"

![Deploy Function](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/29-devops-deployfunction.png)

35. Clique em "Add an Artifact" e selecione o Build que acabamos de criar

![Define Artifact to Deploy](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/30-devops-artifact.png)

36. Você pode ainda definir regras de disparo da release a partir do build para que isso seja feito continuamente.

37. Depois clique em "1 job, 1 task" do stage de release padrão.

38. Entre com as credenciais de sua assinatura Azure e selecione o Azure Function Azure onde será feito o deploy da função.

39. Por fim, inclua configuração do Applications Settings durante o release para especificar o executável node que será utilizado pela function. Lembre-se que esse executável foi copiado junto com o pacote gerado na Build:

![Set App Settings during Release](https://raw.githubusercontent.com/joaoronaldocunha/AzFunction_Typescript/master/assets/31-devops-releaseappsettings.png)

40. Terminada a configuração, você pode disparar tanto manualmente como através do trigger a nova release.

## Referências

- https://docs.microsoft.com/pt-br/azure/azure-functions/functions-test-a-function#javascript-in-vs-code
- https://basarat.gitbooks.io/typescript/docs/testing/jest.html
- https://www.npmjs.com/package/image-thumbnail
- https://jestjs.io/docs/en/configuration.html#testenvironment-string
- https://aurelia.ninja/2019/04/04/a-strategy-for-deploying-a-custom-node-executable-to-azure-functions-on-windows/
