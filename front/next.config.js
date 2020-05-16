const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = withBundleAnalyzer({
    distDir: '.next',

    //BUNDLE_ANALYZE 라는 환경변수를 both 로 설정해 두면 프론트와 서버 둘 다 분석해줌
    /*
      package js 에서 넣는 방법
      scripts 부분에 build 명령어 앞에 BUNDLE_ANALYZE=both 넣어주면 됨 => 윈도우에서 안됨, 맥이나 리눅스만 가능
      => cross-env 설치하고 BUNDLE_ANALYZE=both 앞에 cross-env 넣어줌

     */
    // analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    // analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    // bundleAnalyzerConfig: {
    //     server: {
    //         analyzerMode: 'static',
    //         reportFilename: '../../bundles/server.html'
    //     },
    //     browser: {
    //         analyzerMode: 'static',
    //         reportFilename: '../bundles/client.html'
    //     }
    // },
    webpack(config) {
        //NODE_ENV 배포환경인지 개발환경인지 구분
        const prod = process.env.NODE_ENV === 'production';

        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/), //moment js tree shaking
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
        ];
        if(prod){
            plugins.push(new CompressionPlugin());
        }

        //next 에서 넣어주는 바벨로더 등
        return {
            ...config, //기존 설정을 리턴하고 덮어 씌움

            mode: prod ? 'production' : 'development',

            //hidden-source-map: 소스코드 숨기면서 에러 시 소스맵 제공
            //eval: 빠르게 웹팩 적용
            devtool: prod ? 'hidden-source-map' : 'eval',

            plugins,
        };
    },
});