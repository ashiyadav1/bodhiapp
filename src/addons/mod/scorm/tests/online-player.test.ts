import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import AddonModScormOnlinePlayerPage from '../pages/online-player/online-player';
import { CorePlatform } from '@services/platform';
import { CoreOpener } from '@static/opener';

describe('AddonModScormOnlinePlayerPage', () => {
    it('should open the SCORM player in the app browser on iOS', () => {
        const page = runInInjectionContext(TestBed, () => new AddonModScormOnlinePlayerPage());
        const openSpy = jest.spyOn(CoreOpener, 'openInApp').mockImplementation(() => ({}) as never);

        jest.spyOn(CorePlatform, 'isIOS').mockReturnValue(true);
        (page as any).src = 'https://example.com/scorm/player.php';

        (page as any).openInAppBrowserIfNeeded();

        expect(openSpy).toHaveBeenCalledWith(
            'https://example.com/scorm/player.php',
            expect.objectContaining({
                location: 'yes',
                hideurlbar: 'yes',
                hidenavigationbuttons: 'yes',
            }),
        );
    });
});
