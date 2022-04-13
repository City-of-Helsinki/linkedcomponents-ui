import { TFunction } from 'i18next';
import L from 'leaflet';

export const localizeMap = (t: TFunction): void => {
  L.drawLocal.draw.handlers.marker.tooltip.start = t(
    'common.leaflet.drawLocal.draw.handlers.marker.tooltip.start'
  );
  L.drawLocal.draw.toolbar.buttons.marker = t(
    'common.leaflet.drawLocal.draw.toolbar.buttons.marker'
  );
  L.drawLocal.draw.toolbar.actions.text = t(
    'common.leaflet.drawLocal.draw.toolbar.actions.text'
  );
  L.drawLocal.draw.toolbar.actions.title = t(
    'common.leaflet.drawLocal.draw.toolbar.actions.title'
  );
  L.drawLocal.draw.toolbar.finish.text = t(
    'common.leaflet.drawLocal.draw.toolbar.finish.text'
  );
  L.drawLocal.draw.toolbar.finish.title = t(
    'common.leaflet.drawLocal.draw.toolbar.finish.title'
  );
  L.drawLocal.edit.handlers.edit.tooltip.subtext = t(
    'common.leaflet.drawLocal.edit.handlers.edit.tooltip.subtext'
  );
  L.drawLocal.edit.handlers.edit.tooltip.text = t(
    'common.leaflet.drawLocal.edit.handlers.edit.tooltip.text'
  );
  L.drawLocal.edit.handlers.remove.tooltip.text = t(
    'common.leaflet.drawLocal.edit.handlers.remove.tooltip.text'
  );
  L.drawLocal.edit.toolbar.actions.cancel.text = t(
    'common.leaflet.drawLocal.edit.toolbar.actions.cancel.text'
  );
  L.drawLocal.edit.toolbar.actions.cancel.title = t(
    'common.leaflet.drawLocal.edit.toolbar.actions.cancel.title'
  );
  L.drawLocal.edit.toolbar.actions.clearAll.text = t(
    'common.leaflet.drawLocal.edit.toolbar.actions.clearAll.text'
  );
  L.drawLocal.edit.toolbar.actions.clearAll.title = t(
    'common.leaflet.drawLocal.edit.toolbar.actions.clearAll.title'
  );
  L.drawLocal.edit.toolbar.actions.save.text = t(
    'common.leaflet.drawLocal.edit.toolbar.actions.save.text'
  );
  L.drawLocal.edit.toolbar.buttons.edit = t(
    'common.leaflet.drawLocal.edit.toolbar.buttons.edit'
  );
  L.drawLocal.edit.toolbar.buttons.editDisabled = t(
    'common.leaflet.drawLocal.edit.toolbar.buttons.editDisabled'
  );
  L.drawLocal.edit.toolbar.buttons.remove = t(
    'common.leaflet.drawLocal.edit.toolbar.buttons.remove'
  );
  L.drawLocal.edit.toolbar.buttons.removeDisabled = t(
    'common.leaflet.drawLocal.edit.toolbar.buttons.removeDisabled'
  );
};
