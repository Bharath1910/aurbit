FROM fluent/fluentd

USER root

RUN gem install fluent-plugin-prometheus

USER fluent
ENTRYPOINT ["tini",  "--", "/bin/entrypoint.sh"]

CMD ["fluentd", "-c", "/etc/fluent/fluentd.conf"]