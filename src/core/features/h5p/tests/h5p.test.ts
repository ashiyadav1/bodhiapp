// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { CoreH5PProvider } from '../services/h5p';
import { CoreH5PCore } from '../classes/core';
import { CoreH5PFramework } from '../classes/framework';

describe('CoreH5PProvider', () => {

    let h5pProvider: CoreH5PProvider;

    beforeEach(() => {
        h5pProvider = new CoreH5PProvider();
    });

    it('preserves token when treating H5P URLs', () => {
        const url = 'https://school.edu/webservice/pluginfile.php/1/mod_h5pactivity/package/0/example.h5p' +
            '?token=abc123&forcedownload=1#section';

        expect(h5pProvider.treatH5PUrl(url, 'https://school.edu')).toEqual(
            'https://school.edu/pluginfile.php/1/mod_h5pactivity/package/0/example.h5p?token=abc123',
        );
    });

    it('removes regular query params and fragments when treating H5P URLs', () => {
        const url = 'https://school.edu/pluginfile.php/1/mod_h5pactivity/package/0/example.h5p?forcedownload=1#section';

        expect(h5pProvider.treatH5PUrl(url, 'https://school.edu')).toEqual(
            'https://school.edu/pluginfile.php/1/mod_h5pactivity/package/0/example.h5p',
        );
    });

});

describe('CoreH5PCore', () => {

    let h5pCore: CoreH5PCore;

    beforeEach(() => {
        h5pCore = new CoreH5PCore(new CoreH5PFramework());
    });

    it('adds token to absolute pluginfile media URLs in filtered params', () => {
        const filteredParams = JSON.stringify({
            video: {
                files: [
                    {
                        path: 'https://nursingcourses.bodhihealthedu.org/pluginfile.php/179231/mod_hvp/content/474/' +
                            'videos/video-pbG3wLFo.mp4',
                    },
                ],
            },
            image: {
                path: 'images/local-image.png',
            },
        });

        const result = h5pCore['addWsTokenToFilteredParameters'](
            filteredParams,
            'https://nursingcourses.bodhihealthedu.org',
            'abc123',
        );

        expect(JSON.parse(result)).toEqual({
            video: {
                files: [
                    {
                        path: 'https://nursingcourses.bodhihealthedu.org/pluginfile.php/179231/mod_hvp/content/474/' +
                            'videos/video-pbG3wLFo.mp4?token=abc123',
                    },
                ],
            },
            image: {
                path: 'images/local-image.png',
            },
        });
    });

});
