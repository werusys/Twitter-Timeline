/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { Component, Input, OnChanges, ElementRef, ChangeDetectionStrategy, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { ContextMenuAPI, CONTEXT_MENU_TOKEN } from '../framework';
import vis from 'vis'
// import { Http, RequestOptions, Request, Headers } from '@angular/http';
// import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Tweet } from './tweet';


export interface TwitterSearch {
  statuses: any;
  search_metadata: any;
}


@Component({
  selector: 'timeline',
  templateUrl: 'timeline.component.html',
  styleUrls: ['timeline.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TimelineComponent implements OnChanges {
  @Input() data: any;
  private timeline;

  constructor(private elRef: ElementRef, private http: HttpClient) {

  }

  tweets() {
    return this.http.get<TwitterSearch>('https://localhost:3000/twitter');
  }

  private initTimeline() {
    // DOM element where the Timeline will be attached
    var container = this.elRef.nativeElement.querySelector('#visualization');

    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet([
      {id: 1, content: 'running', start: '2018-04-15', end: '2018-04-16', group: '1', className: 'green'},
      {id: 2, content: 'stopped', start: '2018-04-16', end: '2018-04-17', group: '1', className: 'red'},
      // {id: 3, content: 'item 3', start: '2018-04-18'},
      // {id: 4, content: 'item 4', start: '2018-04-12', end: '2018-04-13'},
      // {id: 5, content: 'item 5', start: '2018-04-25'},
      // {id: 6, content: 'item 6', start: '2018-04-27'}
    ]);

    var groups = [
      {
        id: 1,
        content: 'production',        
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: 2,
        content: 'werusys energy news'
        // Optional: a field 'className', 'style', 'order', [properties]
      }
      // more groups...
    ];

    // Configuration for the Timeline
    var options = {
      stack: true,
      // start: '2018-04-12',
      // end: '2018-04-27',
    };

    //

    this.tweets().subscribe(twitterSearch => {

      var tweets = twitterSearch.statuses;

      options['start'] = tweets[tweets.length - 1].created_at;
      options['end'] = tweets[0].created_at;

      tweets.forEach(tweet => {

        console.warn(tweet.id);

        items.add(
          {
            id: tweet.id,
            content: tweet.full_text,
            start: tweet.created_at,
            group: '2'
          }
        )

      });

      // Create a Timeline
      this.timeline = new vis.Timeline(container, items, groups, options);

    });
  }

   private updateTimelineData(data) {
   }

  ngOnChanges(changes) {

    if (this.timeline == null || this.timeline === undefined) {
      this.initTimeline();
    }

    if (changes.data) {
      this.updateTimelineData(this.data);
    }
  }
}
