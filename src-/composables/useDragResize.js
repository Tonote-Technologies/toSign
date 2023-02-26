import { useActions } from "vuex-composition-helpers/dist";

export const useDragResizeComposable = () => {
  const { editTools } = useActions({
    editTools: "document/editTools",
  });

  const dragEnd = (e, tool) => {
    const dragToUpdate = {
      append_print_id: tool?.append_print?.id == undefined ? "" : tool?.append_print?.id,
      document_upload_id: tool.document_upload_id,
      tool_pos_left: e.x.toString(),
      tool_pos_top: e.y.toString(),
    };

    editTools({ id: tool.id, payload: dragToUpdate });
  };

  const resizeEnd = (e, tool) => {
    const resizeToUpdate = {
      append_print_id: tool.append_print.id == undefined ? "" : tool.append_print.id,
      document_upload_id: tool.document_upload_id,
      tool_width: e.w.toString(),
      tool_height: e.h.toString(),
    };

    editTools({ id: tool.id, payload: resizeToUpdate });
  };

  return { dragEnd, resizeEnd, }
}