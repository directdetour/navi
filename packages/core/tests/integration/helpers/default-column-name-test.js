import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMock, teardownMock } from '../../helpers/mirage-helper';

module('helper:default-column-name', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    setupMock();

    return this.owner.lookup('service:bard-metadata').loadMetadata();
  });

  hooks.afterEach(function() {
    teardownMock();
  });

  test('dateTime column', async function(assert) {
    const column = { type: 'dateTime' };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert.dom('*').hasText('Date', 'The default column name for dateTime is Date');
  });

  test('dimension column', async function(assert) {
    const column = { type: 'dimension', attributes: { name: 'os' } };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert.dom('*').hasText('Operating System', 'The default column name for os dimension is Operating System');
  });

  test('metric column', async function(assert) {
    const column = { type: 'metric', attributes: { name: 'totalPageViews' } };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert
      .dom('*')
      .hasText('Total Page Views', 'The default column name for totalPageViews metric is Total Page Views');
  });

  test('metric column with parameters', async function(assert) {
    const column = {
      type: 'metric',
      attributes: { name: 'revenue', parameters: { currency: 'USD' } }
    };
    this.set('column', column);

    await render(hbs`{{default-column-name column}}`);

    assert
      .dom('*')
      .hasText(
        'Revenue (USD)',
        'The default column name for revenue metric with currency param of USD is Revenue (USD)'
      );
  });
});
