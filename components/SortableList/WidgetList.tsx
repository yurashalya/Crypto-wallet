import React from "react";

import { MARGIN } from "./Config";
import Tile from "./Tile";
import SortableList from "./SortableList";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const tiles = [
  {
    id: "spent",
  },
  {
    id: "cashback",
  },
  {
    id: "recent",
  },
  {
    id: "cards",
  },
];

const WidgetList = () => {
  return (
    <GestureHandlerRootView
      style={{
        paddingHorizontal: MARGIN,
        paddingTop: 5,
      }}
    >
      <SortableList
        editing={true}
        onDragEnd={(positions) =>
          console.log(JSON.stringify(positions, null, 2))
        }
      >
        {[...tiles].map((tile, index) => (
          <Tile
            onLongPress={() => true}
            key={tile.id + "-" + index}
            id={tile.id}
          />
        ))}
      </SortableList>
    </GestureHandlerRootView>
  );
};

export default WidgetList;
