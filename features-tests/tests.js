import { Selector } from 'testcafe';

fixture `Getting Started`
  .page `http://localhost:4200/`;

test('Simple clear day scenario - empty state and search', async t => {
  await t
    .expect(Selector('#no-songs-on-playlist').exists).ok()
    .expect(Selector('#search-field').exists).ok()
    .expect(Selector('#welcome-message').exists).ok()
    .typeText('#search-field', 'https://www.youtube.com/watch?v=c0ruHxX7r3M')
    .click('#search-btn')
    .expect(Selector('#no-songs-on-playlist').exists).notOk()
    .expect(Selector('#playlist').exists).ok()
    .expect(Selector('#playlist').find('.list-item').innerText).eql('A Few Moments Later HD 2 Seconds Video\n00:03\nremove_from_queue')
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
    .wait(1000)
    .expect(Selector('#no-songs-on-playlist').exists).ok()
});

test('Clear day scenario - add items to the bottom, delete from list', async t => {
  await t
    .typeText('#search-field', 'https://www.youtube.com/watch?v=tQ0yjYUFKAE')
    .click('#search-btn')
    .wait(500)
    .typeText('#search-field', 'https://www.youtube.com/watch?v=BSzSn-PRdtI', { replace: true })
    .click('#search-btn')
    .expect(Selector('#playlist').find('.list-item').count).eql(2)
    .expect(Selector('#playlist').find('.list-item').nth(1).innerText).eql('Maroon 5 - Beautiful Mistakes ft. Megan Thee Stallion (Official Music Video)\n03:49\nremove_from_queue')
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
    .expect(Selector('#playlist').find('.list-item').nth(0).innerText).eql('Maroon 5 - Beautiful Mistakes ft. Megan Thee Stallion (Official Music Video)\n03:49\nremove_from_queue')
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
});

test('Clear day scenario - drag and drop', async t => {
  await t
    .typeText('#search-field', 'https://www.youtube.com/watch?v=tQ0yjYUFKAE')
    .click('#search-btn')
    .wait(500)
    .typeText('#search-field', 'https://www.youtube.com/watch?v=BSzSn-PRdtI', { replace: true })
    .click('#search-btn')
    .wait(500)
    .expect(Selector('#playlist').find('.list-item').count).eql(2)
    .dragToElement(Selector('#playlist').find('.list-item').nth(1), Selector('#playlist').find('.list-item').nth(0))
    .wait(500)
    .expect(Selector('#playlist').find('.list-item').nth(1).innerText).eql('Justin Bieber - Peaches ft. Daniel Caesar, Giveon\n03:18\nremove_from_queue')
    .expect(Selector('#playlist').find('.list-item').nth(0).innerText).eql('Maroon 5 - Beautiful Mistakes ft. Megan Thee Stallion (Official Music Video)\n03:49\nremove_from_queue')
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
});

test('Clear day scenario - remove current song', async t => {
  await t
    .typeText('#search-field', 'https://www.youtube.com/watch?v=tQ0yjYUFKAE')
    .click('#search-btn')
    .typeText('#search-field', 'https://www.youtube.com/watch?v=BSzSn-PRdtI', { replace: true })
    .click('#search-btn')
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
    .wait(500)
    .expect(Selector('#playlist').find('.list-item').nth(0).innerText).eql('Maroon 5 - Beautiful Mistakes ft. Megan Thee Stallion (Official Music Video)\n03:49\nremove_from_queue')
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
});

test('Rainy day scenario - search for wrong values', async t => {
  await t
    .click('#search-btn')
    .expect(Selector('#no-songs-on-playlist').exists).ok()
    .typeText('#search-field', 'TEST')
    .click('#search-btn')
    .typeText('#search-field', 'https://www.youtube.com/watch?v=BSzSn-PRdtI', { replace: true })
    .click('#search-btn')
    .expect(Selector('#no-songs-on-playlist').exists).notOk()
    .click(Selector('#playlist').find('.list-item').nth(0).find('button'))
});
