export default () => `
  <!DOCTYPE html>
    <head>
      <meta charset='UTF-8'>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <script>
      // https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/176#issuecomment-683150213
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => () => {};
    </script>
    <body style="overflow: hidden;">
      <div id="root" style="display: flex;"></div>
    </body>
  </html>
`;
