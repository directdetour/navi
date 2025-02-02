import { click, currentURL, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { linkContains } from '../helpers/contains-helpers';
import $ from 'jquery';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | custom reports', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Viewing saved reports', async function(assert) {
    assert.expect(3);

    await visit('/reports');
    assert.dom('.navi-reports-index .navi-collection table').exists();

    let firstReport = '.navi-collection tbody td:first-child a',
      reportTitle = find(firstReport).textContent.trim();

    await click(firstReport);
    assert.ok(
      currentURL().match(/^\/reports\/\d+\/view$/),
      `On clicking the "${reportTitle}" link, user is brought to the appropriate report view`
    );

    assert.dom('.navi-report__title').hasText(reportTitle, `Report title contains text "${reportTitle}" as expected`);
  });

  test('Accessing Report Builder', async function(assert) {
    assert.expect(2);

    await visit('/reports');
    await click(linkContains('New Report'));
    assert.ok(
      currentURL().match(
        /^\/reports\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/edit/
      ),
      'Clicking "New Report" button brings the user to the report builder'
    );

    assert.dom('.report-builder').exists();
  });

  test('Run report with a filter', async function(assert) {
    await visit('/reports/new');

    // Add filter
    await click(
      $('.checkbox-selector--dimension .grouped-list__item:contains(Character) .checkbox-selector__filter')[0]
    );
    await selectChoose('.filter-values--dimension-select__trigger', 'Luigi');
    assert.dom('.filter-builder-dimension__values').containsText('Luigi', 'A filter value can be selected');

    // Run Report
    await click('.navi-report__run-btn');
    assert.dom('.table-widget').exists('Data visualization is shown');
  });
});
