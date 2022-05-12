/* eslint-disable @typescript-eslint/no-explicit-any */
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import { createControlComponent, useLeafletContext } from '@react-leaflet/core';
import leaflet, {
  Control,
  ControlPosition,
  FeatureGroup,
  LeafletEvent,
  LeafletEventHandlerFn,
} from 'leaflet';
import React from 'react';

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

const EditControl = createControlComponent<Control, EditControlProps>(
  (props) => {
    const context = useLeafletContext();

    const onDrawCreate = (e: LeafletEvent) => {
      const { onCreated } = props;
      const container = context.layerContainer || context.map;

      container.addLayer(e.layer);
      onCreated && onCreated(e);
    };

    React.useEffect(() => {
      const { map } = context;

      for (const key in eventHandlers) {
        const type = eventHandlers[key as keyof typeof eventHandlers];

        map.on(type, (evt) => {
          const handlers = Object.keys(eventHandlers).filter(
            (handler) =>
              eventHandlers[handler as keyof typeof eventHandlers] === evt.type
          );
          if (handlers.length === 1) {
            const handler = handlers[0];
            const fn = props[handler as keyof typeof props];

            fn && (fn as LeafletEventHandlerFn)(evt);
          }
        });
      }
      map.on(leaflet.Draw.Event.CREATED, onDrawCreate);

      return () => {
        map.off(leaflet.Draw.Event.CREATED, onDrawCreate);

        for (const key in eventHandlers) {
          const type = eventHandlers[key as keyof typeof eventHandlers];
          const fn = props[key as keyof typeof props];

          if (fn) {
            map.off(type, fn as LeafletEventHandlerFn);
          }
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
  }
);

export default EditControl;
