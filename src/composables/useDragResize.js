// import { ref } from "vue"
import { useActions } from "vuex-composition-helpers/dist";

export const useDragResizeComposable = () => {
  // The logic
  // const { profile, print } = useGetters({
  //   profile: "auth/profile",
  //   print: "print/print",
  // });

  const { editTools, editPublicTools } = useActions({
    editTools: "signLink/editTools",
    editPublicTools: "signLink/editPublicTools",
  });

  const dragEnd = (e, tool) => {
    let toLocal = {
      id: tool.id,
      tool_pos_left: e.x.toString(),
      tool_pos_top: e.y.toString(),
      // tool_width: tool.tool_width,
      // tool_height: tool.tool_height,
    };

    const dragToUpdate = {
      document_id: tool?.document_id,
      document_upload_id: tool.document_upload_id,
      tool_pos_left: e.x.toString(),
      tool_pos_top: e.y.toString(),
      value: tool?.value,
    };

    if (tool.document_id == undefined) {
      editTools({ id: tool.id, payload: dragToUpdate, toLocal });
    } else {
      editPublicTools({ id: tool.id, payload: dragToUpdate, toLocal });
    }
  };

  const resizeEnd = (tool, w, h) => {
    let toLocal = {
      id: tool.id,
      tool_width: w.toString(),
      tool_height: h.toString(),
    };

    const resizeToUpdate = {
      document_id: tool?.document_id,
      document_upload_id: tool.document_upload_id,
      tool_width: w.toString(),
      tool_height: h.toString(),
      value: tool?.value,
    };

    if (tool.document_id == undefined) {
      editTools({ id: tool.id, payload: resizeToUpdate, toLocal });
    } else {
      editPublicTools({ id: tool.id, payload: resizeToUpdate, toLocal });
    }
  };

  return {
    // return values
    dragEnd,
    resizeEnd,
  }
}