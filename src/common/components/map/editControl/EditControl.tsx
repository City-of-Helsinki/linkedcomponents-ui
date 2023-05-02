/* eslint-disable @typescript-eslint/no-explicit-any */
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import {
  createControlHook,
  createElementHook,
  createElementObject,
  createLeafComponent,
  LeafletContextInterface,
  LeafletElement,
} from '@react-leaflet/core';
import leaflet, {
  Control,
  ControlPosition,
  FeatureGroup,
  LeafletEvent,
  LeafletEventHandlerFn,
} from 'leaflet';

interface EditControlProps {
  onCreated?: LeafletEventHandlerFn;
  onDeleted?: LeafletEventHandlerFn;
  onDeleteStart?: LeafletEventHandlerFn;
  onDeleteStop?: LeafletEventHandlerFn;
  onDrawStart?: LeafletEventHandlerFn;
  onDrawStop?: LeafletEventHandlerFn;
  onDrawVertex?: LeafletEventHandlerFn;
  onEdited?: LeafletEventHandlerFn;
  onEditMove?: LeafletEventHandlerFn;
  onEditResize?: LeafletEventHandlerFn;
  onEditStart?: LeafletEventHandlerFn;
  onEditStop?: LeafletEventHandlerFn;
  onEditVertex?: LeafletEventHandlerFn;
  onMarkerContext?: LeafletEventHandlerFn;
  onToolbarClosed?: LeafletEventHandlerFn;
  onToolbarOpened?: LeafletEventHandlerFn;
  draw?: Control.DrawOptions;
  edit?: Control.EditOptions;
  position: ControlPosition;
}

const eventHandlers = {
  onDeleted: leaflet.Draw.Event.DELETED,
  onDeleteStart: leaflet.Draw.Event.DELETESTART,
  onDeleteStop: leaflet.Draw.Event.DELETESTOP,
  onDrawStart: leaflet.Draw.Event.DRAWSTART,
  onDrawStop: leaflet.Draw.Event.DRAWSTOP,
  onDrawVertex: leaflet.Draw.Event.DRAWVERTEX,
  onEdited: leaflet.Draw.Event.EDITED,
  onEditMove: leaflet.Draw.Event.EDITMOVE,
  onEditResize: leaflet.Draw.Event.EDITRESIZE,
  onEditStart: leaflet.Draw.Event.EDITSTART,
  onEditStop: leaflet.Draw.Event.EDITSTOP,
  onEditVertex: leaflet.Draw.Event.EDITVERTEX,
  onMarkerContext: leaflet.Draw.Event.MARKERCONTEXT,
  onToolbarClosed: leaflet.Draw.Event.TOOLBARCLOSED,
  onToolbarOpened: leaflet.Draw.Event.TOOLBAROPENED,
};

export function createEditControlComponent(
  createInstance: (
    props: EditControlProps,
    context: LeafletContextInterface
  ) => Control
) {
  const createElement = (
    props: EditControlProps,
    context: LeafletContextInterface
  ): LeafletElement<Control> => {
    const { map } = context;

    const onDrawCreated = (e: LeafletEvent) => {
      const { onCreated } = props;

      const container = context.layerContainer || context.map;
      container.addLayer(e.layer);

      onCreated && onCreated(e);
    };

    map.on(leaflet.Draw.Event.CREATED, onDrawCreated);

    for (const key in eventHandlers) {
      const type = eventHandlers[key as keyof typeof eventHandlers];

      map.on(type, (evt) => {
        const handler = Object.keys(eventHandlers).find(
          (handler) =>
            eventHandlers[handler as keyof typeof eventHandlers] === evt.type
        );

        const fn = props[handler as keyof typeof props];

        typeof fn === 'function' && fn(evt);
      });
    }

    return createElementObject(createInstance(props, context), context);
  };

  const useElement = createElementHook(createElement);
  const useControl = createControlHook(useElement);

  return createLeafComponent(useControl);
}

const EditControl = createEditControlComponent((props, context) => {
  const { layerContainer } = context;
  const { draw, edit, position } = props;

  return new Control.Draw({
    draw,
    edit: { ...edit, featureGroup: layerContainer as FeatureGroup },
    position,
  });
});

export default EditControl;
