import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgLibrary, SymbolType, SymbolInputType, ConfigPropType } from './framework';
import { LibModuleNgFactory } from './module.ngfactory';

import { ExampleComponent } from './example/example.component';
import { TimelineComponent } from './timeline/timeline.component';
import { MyChartComponent } from './my-chart/my-chart.component';
import { HttpClientModule } from '@angular/common/http';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { TwitterProxyInterceptor } from './timeline/twitterproxy.interceptor';


@NgModule({
  declarations: [ ExampleComponent, TimelineComponent, MyChartComponent ],
  imports: [ CommonModule, HttpClientModule ] ,
  exports: [ ExampleComponent, TimelineComponent, MyChartComponent ],
  entryComponents: [ ExampleComponent, TimelineComponent, MyChartComponent ],
  providers: [
    // HttpClientModule,
  //   {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: TwitterProxyInterceptor,
  //   multi: true
  // }
],

})
export class LibModule { }

export class ExtensionLibrary extends NgLibrary {
  module = LibModule;
  moduleFactory = LibModuleNgFactory;
  symbols: SymbolType[] = [
    {
      name: 'example-symbol',
      displayName: 'Example Symbol',
      dataParams: { shape: 'single' },
      thumbnail: '^/assets/images/example.svg',
      compCtor: ExampleComponent,
      inputs: [
        SymbolInputType.Data,
        SymbolInputType.PathPrefix
      ],
      generalConfig: [
        {
          name: 'Example Options',
          isExpanded: true,
          configProps: [
            { propName: 'bkColor', displayName: 'Background color', configType: ConfigPropType.Color, defaultVal: 'white' },
            { propName: 'fgColor', displayName: 'Color', configType: ConfigPropType.Color, defaultVal: 'black' }
          ]
        }
      ],
      layoutWidth: 200,
      layoutHeight: 100
    },
    {
      name: 'timeline-symbol',
      displayName: 'Timeline Symbol',
      dataParams: { shape: 'single' },
      thumbnail: '^/assets/images/example.svg',
      compCtor: TimelineComponent,
      inputs: [
        SymbolInputType.Data,
        SymbolInputType.PathPrefix
      ],
      generalConfig: [
        {
          name: 'Timeline Options',
          isExpanded: true,
          configProps: [
            { propName: 'bkColor', displayName: 'Background color', configType: ConfigPropType.Color, defaultVal: 'white' },
            { propName: 'fgColor', displayName: 'Color', configType: ConfigPropType.Color, defaultVal: 'black' }
          ]
        }
      ],
      layoutWidth: 200,
      layoutHeight: 100
    },
    {
      name: 'my-chart-symbol',
      displayName: 'Chart Symbol',
      dataParams: { shape: 'crosstab', dataMode: 'recordedvalue' },
      thumbnail: '^/assets/images/example.svg',
      compCtor: MyChartComponent,
      inputs: [
        SymbolInputType.Data
      ],
      generalConfig: [
        {
          name: 'Chart Options',
          isExpanded: true,
          configProps: [
            { propName: 'chartType',
              displayName: 'Chart Type', 
              configType: ConfigPropType.Dropdown,              
              configItems: [
                { text: 'bar', value: 'bar'},
                { text: 'radar', value: 'radar'}
              ],
              defaultVal: 'bar' },
            { propName: 'title', displayName: 'Title', configType: ConfigPropType.Text, defaultVal: 'Title goes here' },
            { propName: 'bgColor', displayName: 'Background', configType: ConfigPropType.Color, defaultVal: 'white' }
          ]
        }
      ],
      menuCommands: [
        {displayName: 'Toggle Average', name: 'toggle-average', showInAllModes: true, isDisabled: false, isHidden: false }
      ],      
      layoutWidth: 200,
      layoutHeight: 200
    }    
  ];
}
