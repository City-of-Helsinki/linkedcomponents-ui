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
  onEdited?: LeafletEventHandlerFn;
  onDrawStart?: LeafletEventHandlerFn;
  onDrawStop?: LeafletEventHandlerFn;
  onDrawVertex?: LeafletEventHandlerFn;
  onEditStart?: LeafletEventHandlerFn;
  onEditMove?: LeafletEventHandlerFn;
  onEditResize?: LeafletEventHandlerFn;
  onEditVertex?: LeafletEventHandlerFn;
  onEditStop?: LeafletEventHandlerFn;
  onDeleted?: LeafletEventHandlerFn;
  onDeleteStart?: LeafletEventHandlerFn;
  onDeleteStop?: LeafletEventHandlerFn;
  onCreated?: LeafletEventHandlerFn;
  draw?: Control.DrawOptions;
  edit?: Control.EditOptions;
  position: ControlPosition;
}

const eventHandlers = {
  onEdited: 'draw:edited',
  onDrawStart: 'draw:drawstart',
  onDrawStop: 'draw:drawstop',
  onDrawVertex: 'draw:drawvertex',
  onEditStart: 'draw:editstart',
  onEditMove: 'draw:editmove',
  onEditResize: 'draw:editresize',
  onEditVertex: 'draw:editvertex',
  onEditStop: 'draw:editstop',
  onDeleted: 'draw:deleted',
  onDeleteStart: 'draw:deletestart',
  onDeleteStop: 'draw:deletestop',
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

    for (const key in eventHandlers) {
      const type = eventHandlers[key as keyof typeof eventHandlers];

      map.on(type, (evt) => {
        const handlers = Object.keys(eventHandlers).filter(
          (handler) =>
            eventHandlers[handler as keyof typeof eventHandlers] === evt.type
        );

        if (handlers.length === 1) {
          const handler = handlers[0];
          const fn = props[handler as keyof typeof props] as
            | LeafletEventHandlerFn
            | undefined;

          fn && fn(evt);
        }
      });
    }

    map.on(leaflet.Draw.Event.CREATED, onDrawCreated);

    return createElementObject(createInstance(props, context), context);
  };

  const useElement = createElementHook(createElement);
  const useControl = createControlHook(useElement);
  return createLeafComponent(useControl);
}

const EditControl = createEditControlComponent((props, context) => {
  const getDrawOptions = () => {
    const { layerContainer } = context;
    const { draw, edit, position } = props;
    const options: Control.DrawConstructorOptions = {
      edit: {
        ...edit,
        featureGroup: layerContainer as FeatureGroup,
      },
    };

    if (draw) {
      options.draw = { ...(draw as Control.DrawOptions) };
    }

    if (position) {
      options.position = position;
    }

    return options;
  };

  return new Control.Draw(getDrawOptions());
});

export default EditControl;
