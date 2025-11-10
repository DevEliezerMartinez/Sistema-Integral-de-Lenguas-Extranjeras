import React, { useEffect, useState } from "react";
import { Breadcrumb, Timeline, message, Pagination } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [success, setSuccess] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchNotificaciones = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!usuario || !token) {
      message.error("No se encontró el usuario o el token.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/notificaciones/${usuario.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setNotificaciones(data.notificaciones || []);
      } else {
        setSuccess(false);
        message.error(data.message || "Error al cargar las notificaciones");
      }
    } catch (error) {
      setSuccess(false);
      message.error("Ocurrió un error al cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Token no encontrado, por favor inicia sesión.");
      return;
    }

    const hide = message.loading("Eliminando notificación...", 0);
    setLoadingDeleteId(id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/notificaciones/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      hide();
      setLoadingDeleteId(null);

      if (response.ok) {
        message.success("Notificación eliminada correctamente");
        const nuevas = notificaciones.filter((n) => n.id !== id);
        setNotificaciones(nuevas);
        const totalPages = Math.ceil(nuevas.length / pageSize);
        if (page > totalPages && totalPages > 0) setPage(totalPages);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Error al eliminar la notificación");
      }
    } catch (error) {
      hide();
      setLoadingDeleteId(null);
      message.error("Ocurrió un error al eliminar la notificación");
    }
  };

  const paginatedData = notificaciones.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const timelineItems = !success
    ? [
        {
          children: (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
              Hubo un problema al cargar las notificaciones.
            </div>
          ),
        },
      ]
    : loading
    ? [
        {
          children: (
            <div className="bg-gray-50 border border-gray-200 text-gray-500 p-4 rounded-lg text-center shadow-sm animate-pulse">
              Cargando notificaciones...
            </div>
          ),
        },
      ]
    : paginatedData.length > 0
    ? paginatedData.map((notificacion) => ({
        key: notificacion.id,
        children: (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm flex justify-between items-start hover:shadow-md transition-all">
            <div>
              <p className="font-medium text-gray-800 leading-tight">
                {notificacion.mensaje}
              </p>
              <p className="text-xs text-gray-500 mt-1 italic">
                {formatearFecha(notificacion.fecha_notificacion)}
              </p>
            </div>
            <DeleteOutlined
              className={`cursor-pointer text-lg ${
                loadingDeleteId === notificacion.id
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700"
              }`}
              onClick={() =>
                loadingDeleteId ? null : handleDelete(notificacion.id)
              }
            />
          </div>
        ),
      }))
    : [
        {
          children: (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-lg text-center shadow-sm">
              No hay notificaciones.
            </div>
          ),
        },
      ];

  return (
    <div className="px-4">
      {/* Breadcrumb fijo visible incluso durante la carga */}
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Docente</p>,
          },
          {
            title: <a>Notificaciones Docente</a>,
          },
        ]}
      />

      <h2 className="Montserrat font-medium text-2xl text-center mt-3">
        Mis Notificaciones
      </h2>

      <Timeline className="mt-8 px-4" items={timelineItems} />

      {notificaciones.length > pageSize && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            total={notificaciones.length}
            pageSize={pageSize}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}

export default Notificaciones;
